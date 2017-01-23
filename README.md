# lifecycle-management-for-docker [![Build Status][travis-image]][travis-url] [![dependencies Status](https://david-dm.org/StephenCoady/lifecycle-management-for-docker/status.png)](https://david-dm.org/StephenCoady/lifecycle-management-for-docker)
> NEED TO ADD READ ME

## Easy Installation

docker run -d -p 3000:3000 -v /var/run/docker.sock:/var/run/docker.sock scoady2/lifecycle-management-for-docker

## Run using node
Note: The Docker API must be listening on /var/run/docker.sock
```js
$ node app.js
```
## License

MIT © [Stephen Coady]()


[travis-image]: https://travis-ci.org/StephenCoady/lifecycle-management-for-docker.svg?branch=master
[travis-url]: https://travis-ci.org/StephenCoady/lifecycle-management-for-docker
[daviddm-image]: https://david-dm.org/StephenCoady/lifecycle-management-for-docker.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/StephenCoady/lifecycle-management-for-docker
