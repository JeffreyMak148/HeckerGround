cd /home/ec2-user/HeckerGround

aws ecr get-login-password --region ap-southeast-2 | docker login --username AWS --password-stdin 769244290740.dkr.ecr.ap-southeast-2.amazonaws.com

docker-compose -f docker-compose-ec2.yml down
docker-compose -f docker-compose-ec2.yml up --pull always --build --force-recreate -d
