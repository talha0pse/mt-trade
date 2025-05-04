resource "kubernetes_namespace" "mt_project" {
  metadata {
    name = "mt-project"
  }
}
