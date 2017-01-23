# LifeCycle Management For Docker 

# [![Build Status][travis-image]][travis-url] [![dependencies Status][daviddm-image]][daviddm-url] [![GitHub tag](https://img.shields.io/github/tag/StephenCoady/lifecycle-management-for-docker.svg)]() [![Docker Pulls](https://img.shields.io/docker/pulls/scoady2/lifecycle-management-for-docker.svg)]() [![Coverage](https://sonarqube.com/api/badges/measure?key=lifecycle-management-for-docker&metric=coverage)]() [![Techinal Debt](https://sonarqube.com/api/badges/measure?key=lifecycle-management-for-docker&metric=sqale_debt_ratio)]()
> This project aims to provide graphical option for managing Docker on a remote host. It will provide container, image and network orchestration through a graphical user interface.

## Usage

#### Docker Container
```sh
docker run -d -p 3000:3000 -v /var/run/docker.sock:/var/run/docker.sock scoady2/lifecycle-management-for-docker
```
#### Using Node.js
Note: The Docker API must be listening on /var/run/docker.sock
```sh
$ node app.js
```
## License

MIT © [Stephen Coady]()


[travis-image]: https://img.shields.io/travis/StephenCoady/lifecycle-management-for-docker.svg?branch=master
[travis-url]: https://travis-ci.org/StephenCoady/lifecycle-management-for-docker
[daviddm-image]: https://img.shields.io/david/StephenCoady/lifecycle-management-for-docker.svg?
[daviddm-url]: https://david-dm.org/StephenCoady/lifecycle-management-for-docker
