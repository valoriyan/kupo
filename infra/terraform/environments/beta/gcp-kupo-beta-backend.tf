provider "google" {
    project = "keen-boulder-370101"
}

resource "google_cloud_run_service" "default" {
    name     = "kupo-beta-backend"
    location = "us-east4"

    metadata {
      annotations = {
        "run.googleapis.com/client-name" = "terraform"
      }
    }

    template {
      spec {
        containers {
          image = "us-east4-docker.pkg.dev/keen-boulder-370101/kupo-beta-docker-repo/kupo-beta-backend:1.0"
        
	        env {
	          name = "DATABASE_NAME"
	          value = "kupo_dev"
	        }
	        env {
	          name = "FRONTEND_BASE_URL"
	          value = "http://localhost:3000"
	        }
	        env {
	          name = "IMPLEMENTED_BLOB_STORAGE_SERVICE_TYPE"
	          value = "LOCAL"
	        }
	        env {
	          name = "IMPLEMENTED_DATABASE_SERVICE_TYPE"
	          value = "LOCAL_POSTGRES"
	        }
	        env {
	          name = "IMPLEMENTED_EMAIL_SERVICE_TYPE"
	          value = "LOCAL"
	        }
	        env {
	          name = "LOCAL_BLOB_STORAGE_DIRECTORY"
	          value = "tmp"
	        }
	        env {
	          name = "IMPLEMENTED_DATABASE_SERVICE_TYPE"
	          value = "REMOTE_POSTGRES"
	        }
	        env {
	          name = "PRODUCTION_ENVIRONMENT"
	          value = "test"
	        }
	        env {
	          name = "SALT"
	          value = "temporarysalt"
	        }
	        env {
	          name = "WASABI_BUCKET"
	          value = "kupo-dev"
	        }
	        env {
	          name = "WASABI_BUCKET_REGION"
	          value = "us-east-2"
	        }
        }
      }
    }
 }

 #data "google_iam_policy" "noauth" {
 #  binding {
 #    role = "roles/run.invoker"
 #    members = ["allUsers"]
 #  }
 #}

 #resource "google_cloud_run_service_iam_policy" "noauth" {
 #  location    = google_cloud_run_service.default.location
 #  project     = google_cloud_run_service.default.project
 #  service     = google_cloud_run_service.default.name
 #
 #  policy_data = data.google_iam_policy.noauth.policy_data
#}
