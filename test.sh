cd frontend
yarn build
cd ..
rsync -avz --delete -e "ssh -i ~/.ssh/user" backend/ user@34.169.83.101:/home/winterlove1999/newshop

