cd /home/ec2-user
sudo scp -r access-refresh-token-keys/ HeckerGround/back-end/
sudo scp application-prod.properties HeckerGround/back-end/src/main/resources/

cd /home/ec2-user/HeckerGround

aws ecr get-login-password --region ap-southeast-2 | docker login --username AWS --password-stdin 470684059444.dkr.ecr.ap-southeast-2.amazonaws.com

docker compose -f docker-compose-ec2.yml down
docker compose -f docker-compose-ec2.yml up --pull always --build --force-recreate -d
