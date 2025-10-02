# Helol
Full-stack system for a digital platform "Helol" that serves as a tool to receive, and solve citizens' complaints.

## Usage
### Clone the repo
```bash
git clone https://github.com/sahar-crypto/Helol.git
```
### Setup the server
**With Docker:**
1. Download, install, and open [docker](https://docs.docker.com/get-started/get-docker/)
2. Make sure you're inside the main directory `Helol`
3. Run the following commands to run the backend server
```bash
docker-compose --env-file .env.backend build --no-cache
docker-compose --env-file .env.backend up
```
**Without Docker**
1. Download and install [python](https://www.python.org/downloads/).
2. Setup the backend
```bash
cd helolBackend
pip3 install -r requirements.txt
python3 manage.py makemigrations --noinput
python3 manage.py migrate --noinput
python3 manage.py upsertNews
python3 manage.py runserver
```
3. Setup the frontend
```bash
cd helol-front-end/reactSource
npm install
npm run dev
```
4. Open up this [link](http://localhost:5173/) in your browser.


