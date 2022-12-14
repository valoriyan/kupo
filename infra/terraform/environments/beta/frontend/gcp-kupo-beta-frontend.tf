provider "google" {
    project = "keen-boulder-370101"
}

resource "google_cloud_run_service" "default" {
    name     = "kupo-beta-frontend"
    location = "us-east4"

    metadata {
      annotations = {
        "run.googleapis.com/client-name" = "terraform"
      }
    }

    template {
      spec {
        containers {
          image = "us.gcr.io/keen-boulder-370101/kupo/kupo-beta-frontend:1.0"
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
