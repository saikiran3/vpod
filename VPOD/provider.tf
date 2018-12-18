provider "aws" {
  assume_role {
      role_arn = "arn:aws:iam::912607726479:role/FinOS"
  }
  region     = "${var.region}"
}