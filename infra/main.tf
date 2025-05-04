module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  name   = "mt-vpc"
  cidr   = "10.0.0.0/16"
  azs    = ["ap-south-1a", "ap-south-1b"]
  public_subnets  = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnets = ["10.0.3.0/24", "10.0.4.0/24"]
}

module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  cluster_name    = var.cluster_name
  cluster_version = "1.29"
  subnets         = module.vpc.private_subnets
  vpc_id          = module.vpc.vpc_id

  node_groups = {
    default = {
      desired_capacity = 2
      max_capacity     = 4
      min_capacity     = 2

      instance_types = ["t3.medium"]
    }
  }
}
