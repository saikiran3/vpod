variable "aws_key_name" {
	description = "Use this variable for Pem key"
}
variable "username" {
	description = "Name of your instance. This will be used for tagging your resources.",
      type = "string"
}
variable "stack" {
	description = "ami that will be used to ssh",
      type = "string"
}
variable "instanceType" {
	description = "Type of your instance. This will be used for tagging your resources.",
      type = "string"
}
variable "scheduler" {
	description = "Name of your organisation. This will be used for tagging your resources.",
      type = "string"
}
variable "duration" {
	description = "Name of your organisation. This will be used for tagging your resources.",
      type = "string"
}
variable "AccountOwner" {
	description = "Name of your organisation. This will be used for tagging your resources.",
      default = "Raj Valavala"
}
variable "region" {
    description = "Name of the region in which all the resources will create"
    default = "us-east-2"
}
variable "VPCId" {
    description = "IP Cidr from which you are likely to RDP into the instances. You can add rules later by modifying the created security groups e.g. 54.32.98.160/32"
    default = "vpc-09d3eba574db12bd7"
}
variable "BastionHostPrivateIP" {
    description = "IP Cidr from which you are likely to RDP into the instances. You can add rules later by modifying the created security groups e.g. 54.32.98.160/32"
    default = "10.0.0.51/32"
}
variable "subnetId" {
    description = "private subnet id"
    default = "subnet-023bbbb762705c500"
}

variable "volumeSize" {
    description = "IP Cidr from which you are likely to RDP into the instances. You can add rules later by modifying the created security groups e.g. 54.32.98.160/32"
    default = "30"
}