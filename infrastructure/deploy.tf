data "google_project" "project" {}

data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

provider "google" {

  project = "valoriyan"
  region  = "us-east4"
}

####################################################################################################
####################################################################################################
# Setup Static outbound IP addresses
# https://cloud.google.com/run/docs/configuring/static-outbound-ip#terraform_3
####################################################################################################
####################################################################################################

# Create VPC for kupo-beta
resource "google_compute_network" "default" {
  provider = google
  name     = "valoriyan-ip-network-1"
}

# Create subnet in VPC kupo-beta-sub for VPC Access connector
resource "google_compute_subnetwork" "kupo_beta" {
  provider      = google
  name          = "kupo-beta-subnetwork"
  ip_cidr_range = "10.10.0.0/28"
  network       = google_compute_network.default.name
  region        = "us-east4"
}

# Create serverless VPC access connector
resource "google_project_service" "vpc" {
  provider           = google
  service            = "vpcaccess.googleapis.com"
  disable_on_destroy = false
}

resource "google_vpc_access_connector" "kupo_beta_backend" {
  provider = google
  name     = "kupo-beta-backend-conn"
  region   = "us-east4"

  subnet {
    name = google_compute_subnetwork.kupo_beta.name
  }

  # Wait for VPC API enablement
  # before creating this resource
  depends_on = [
    google_project_service.vpc
  ]
}

# Create new Cloud Router to program NAT gateway
resource "google_compute_router" "kupo_beta" {
  provider = google
  name     = "kupo-beta-router"
  network  = google_compute_network.default.name
  region   = google_compute_subnetwork.kupo_beta.region
}

# Reserve static IP address
resource "google_compute_address" "kupo_beta_backend" {
  provider = google
  name     = "kupo-beta-backend-static-ip-address"
  region   = google_compute_subnetwork.kupo_beta.region
}

# NAT gateway config to route traffic originating from VPC using static IP
resource "google_compute_router_nat" "kupo_beta" {
  provider = google
  name     = "kupo-beta-static-nat"
  router   = google_compute_router.kupo_beta.name
  region   = google_compute_subnetwork.kupo_beta.region

  nat_ip_allocate_option = "MANUAL_ONLY"
  nat_ips                = [google_compute_address.kupo_beta_backend.self_link]

  source_subnetwork_ip_ranges_to_nat = "LIST_OF_SUBNETWORKS"
  subnetwork {
    name                    = google_compute_subnetwork.kupo_beta.id
    source_ip_ranges_to_nat = ["ALL_IP_RANGES"]
  }
}

####################################################################################################
####################################################################################################
# Setup Services
####################################################################################################
####################################################################################################


# Cloud Run VPC connector that all routes egress traffic
resource "google_cloud_run_service" "kupo_beta_backend" {
  provider = google
  name     = "kupo-beta-backend"
  location = google_compute_subnetwork.kupo_beta.region

  template {
    spec {
      service_account_name = "terraform-julian-local@valoriyan.iam.gserviceaccount.com"
      containers {
        # Replace with the URL of your container
        #   gcr.io/<YOUR_GCP_PROJECT_ID>/<YOUR_CONTAINER_NAME>
        image = "us-docker.pkg.dev/valoriyan/kupo-docker-repo/kupo-beta-backend"
        env {
          name  = "APPNAME"
          value = "kupo-beta-backend"
        }
        env {
          name  = "DATABASE_NAME"
          value = "df8br9he9qkh1s"
        }
        env {
          name  = "DATABASE_URL"
          value = "postgres://csopmrylomgtaj:c9b76fa9ac20f73fb8f9c5a0d5a00db9c490ffcda30438f9d2581e5f9251c8f5@ec2-23-23-133-10.compute-1.amazonaws.com:5432/df8br9he9qkh1s"
        }
        env {
          name  = "FRONTEND_BASE_URL"
          value = "https://beta.kupo.social"
        }
        env {
          name  = "IMPLEMENTED_BLOB_STORAGE_SERVICE_TYPE"
          value = "WASABI"
        }
        env {
          name  = "IMPLEMENTED_DATABASE_SERVICE_TYPE"
          value = "REMOTE_POSTGRES"
        }
        env {
          name  = "IMPLEMENTED_EMAIL_SERVICE_TYPE"
          value = "SEND_GRID"
        }
        env {
          name = "JWT_PRIVATE_KEY"
          value_from {
            secret_key_ref {
              key  = "latest"
              name = "kupo_beta_backend_JWT_PRIVATE_KEY"
            }
          }
        }
        env {
          name  = "LOCAL_BLOB_STORAGE_DIRECTORY"
          value = "tmp"
        }
        env {
          name  = "NODE_OPTIONS"
          value = "--max_old_space_size=2560"
        }
        env {
          name  = "PRODUCTION_ENVIRONMENT"
          value = "beta"
        }
        env {
          name = "SALT"
          value_from {
            secret_key_ref {
              key  = "latest"
              name = "kupo_beta_backend_SALT"
            }
          }
        }
        env {
          name = "SECURION_PAY_PRIVATE_KEY"
          value_from {
            secret_key_ref {
              key  = "latest"
              name = "kupo_beta_backend_SECURION_PAY_PRIVATE_KEY"
            }
          }
        }
        env {
          name = "SENDGRID_API_KEY"
          value_from {
            secret_key_ref {
              key  = "latest"
              name = "kupo_beta_backend_SENDGRID_API_KEY"
            }
          }
        }
        env {
          name = "WASABI_ACCESS_KEY"
          value_from {
            secret_key_ref {
              key  = "latest"
              name = "kupo_beta_backend_WASABI_ACCESS_KEY"
            }
          }
        }
        env {
          name  = "WASABI_BUCKET"
          value = "kupo-beta"
        }
        env {
          name  = "WASABI_BUCKET_REGION"
          value = "us-east-2"
        }
        env {
          name = "WASABI_SECRET_ACCESS_KEY"
          value_from {
            secret_key_ref {
              key  = "latest"
              name = "kupo_beta_backend_WASABI_SECRET_ACCESS_KEY"
            }
          }
        }

      }
    }
    metadata {
      annotations = {
        "run.googleapis.com/vpc-access-connector" = google_vpc_access_connector.kupo_beta_backend.name
        "run.googleapis.com/vpc-access-egress"    = "all-traffic"
        "autoscaling.knative.dev/maxScale"        = "5"
        "autoscaling.knative.dev/minScale"        = "1"
      }
    }
  }


  metadata {
    annotations = {
      "run.googleapis.com/ingress" = "all"
    }
  }
}


# Cloud Run VPC connector that all routes egress traffic
resource "google_cloud_run_service" "kupo_beta_frontend" {
  provider = google
  name     = "kupo-beta-frontend"
  location = google_compute_subnetwork.kupo_beta.region

  template {
    spec {
      containers {
        image = "us-docker.pkg.dev/valoriyan/kupo-docker-repo/kupo-beta-frontend"
        env {
          name  = "API_BASE_URL"
          value = "https://beta-api.kupo.social"
        }
        env {
          name  = "API_WEBSOCKET_URL"
          value = "ws://beta-api.kupo.social"
        }
        env {
          name  = "NODE_OPTIONS"
          value = "--max_old_space_size=2560"
        }
      }
    }
    metadata {
      annotations = {
        "run.googleapis.com/vpc-access-connector" = google_vpc_access_connector.kupo_beta_backend.name
        "run.googleapis.com/vpc-access-egress"    = "all-traffic"
        "autoscaling.knative.dev/maxScale"        = "5"
        "autoscaling.knative.dev/minScale"        = "1"
      }
    }
  }


  metadata {
    annotations = {
      "run.googleapis.com/ingress" = "all"
    }
  }
}


####################################################################################################
####################################################################################################
# Set up domain routing
# https://cloud.google.com/run/docs/mapping-custom-domains#terraform
####################################################################################################
####################################################################################################


resource "google_cloud_run_domain_mapping" "kupo_beta_backend" {
  name     = "beta-api.kupo.social"
  location = google_cloud_run_service.kupo_beta_backend.location
  metadata {
    namespace = data.google_project.project.project_id
  }
  spec {
    route_name = google_cloud_run_service.kupo_beta_backend.name
  }
}

resource "google_cloud_run_domain_mapping" "kupo_beta_frontend" {
  name     = "beta.kupo.social"
  location = google_cloud_run_service.kupo_beta_frontend.location
  metadata {
    namespace = data.google_project.project.project_id
  }
  spec {
    route_name = google_cloud_run_service.kupo_beta_frontend.name
  }
}


# resource "google_cloud_run_service_iam_policy" "open_kupo_beta_backend" {
#   location = google_cloud_run_service.kupo_beta_backend.location
#   # project  = google_cloud_run_service.kupo_beta_backend.project
#   service = google_cloud_run_service.kupo_beta_backend.name

#   policy_data = data.google_iam_policy.noauth.policy_data
# }

# resource "google_cloud_run_service_iam_policy" "open_kupo_beta_frontend" {
#   location = google_cloud_run_service.kupo_beta_frontend.location
#   project  = google_cloud_run_service.kupo_beta_frontend.project
#   service  = google_cloud_run_service.kupo_beta_frontend.name

#   policy_data = data.google_iam_policy.noauth.policy_data
# }
