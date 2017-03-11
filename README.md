# LifeCycle Management For Docker 


| Build Status | Dependencies | Version | Docker Image | Coverage | Technical Debt |
|---|---|---|---|---|---|
|[![Build][travis-image]][travis-url]|[![Deps!][daviddm-image]][daviddm-url]|[![Tag!][github-image]][github-url]|[![Docker][docker-image]][docker-url]|[![Coverage][coverage-image]][sonar-url]|[![Tech Debt][tech-debt-image]][sonar-url]|
> This project aims to provide graphical option for managing Docker on a remote host. It will provide container, image and network orchestration through a graphical user interface.

## Usage

#### Docker Container
```
docker run -d -p 3000:3000 -v /var/run/docker.sock:/var/run/docker.sock scoady2/lifecycle-management-for-docker
```

#### Using Node.js
Note: The Docker API must be listening on /var/run/docker.sock
```
node index.js
```

#### Run tests
```
npm test
```

#### Run coverage report
```
npm run coverage
```

## Documentation
To view the API documentation for the application navigate to http://`<hostname>`:3000/docs

## License

MIT © [Stephen Coady]()


[travis-image]: https://img.shields.io/travis/StephenCoady/lifecycle-management-for-docker.svg?branch=master
[travis-url]: https://travis-ci.org/StephenCoady/lifecycle-management-for-docker
[daviddm-image]: https://img.shields.io/david/StephenCoady/lifecycle-management-for-docker.svg
[daviddm-url]: https://david-dm.org/StephenCoady/lifecycle-management-for-docker
[github-image]: https://img.shields.io/github/tag/StephenCoady/lifecycle-management-for-docker.svg
[github-url]: https://github.com/StephenCoady/lifecycle-management-for-docker/releases
[docker-image]: https://img.shields.io/docker/pulls/scoady2/lifecycle-management-for-docker.svg
[docker-url]: https://hub.docker.com/r/scoady2/lifecycle-management-for-docker/
[coverage-image]: https://sonarqube.com/api/badges/measure?key=lifecycle-management-for-docker&metric=coverage
[tech-debt-image]: https://sonarqube.com/api/badges/measure?key=lifecycle-management-for-docker&metric=sqale_debt_ratio
[sonar-url]: https://sonarqube.com/dashboard?id=lifecycle-management-for-docker
