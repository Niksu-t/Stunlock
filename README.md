# Stunlock

Stunlock is a proprietary (perhaps source-available upon release) web application developed in part of a university course.

Stunlock is a web application consisting of a [client](client/README.md) built with Vite.js, and a [backend](BackEnd/README.md) built with Express.js. The backend handles all heavier loads, user information, data, business logic etc. The client is served by a [web server](server/README.md), which enables for example server side rendering and routing.

The application is hosted on a IaaS (Infrastructure as a service) Ubuntu virtual machine with Apache2 serving as a reverse proxy.

## How to run

At present there is no build script, so building and running the front-end and backend are seperate.

Build the client:

```shell
cd client
npm install
npm run build
```

Next, move the built bin to the [server](/server/) directory.

Next, run the web server:
 
```shell
cd server
npm install
npm start
```

Next, run the API (backend):

```shell
cd BackEnd
npm install
npm start
```

# Features

Stunlock is aimed at preventing pain from rheumatoid flares/episodes by predicting inflammation and defining medical intervention before pain arrives. Stunlock predicts flares by HRV-data, which changes at the onset of inflammation thanks to the C-reactive protein.

With Stunlock the user can visualize HRV data and keep track of well-being by filling diary entries daily. Stunlock can detect abnormal readings and reccomend sending a report to the users designated healthcare professional.

### Patient-role

- Diary entries: Pain points, sleep, nutrition, stiffness, stress and external notes.
- HRV-data graphs collected by the Kubios app.
- Designating a team of healthcare professionals as caretakers, to which reports of abnormal states will be sent to. (not implemented)

### Healthcare professional -role (not implemented)

- Review sent reports and define next steps for possible medical intervention on a ticket basis.

### Responsiveness
- The website has breakpoints for different screen sizes. All features are designed to be usable on both desktop and mobile devices. 

## Deployments and links

- [IaaS client deployment](https://stunlock.northeurope.cloudapp.azure.com)
- [IaaS API deployment](https://stunlock.northeurope.cloudapp.azure.com/api/) (Same origin, web server acting as a reverse proxy)
- [Apidoc](https://stunlock.northeurope.cloudapp.azure.com/api/docs/)
- [Figma wireframe mockup](https://www.figma.com/design/k0gFv2LaYGmuexjPFx1isa/Stunlock?node-id=0-1&t=iIFvANdM0Ib9vnAS-1)

## Workflow
See [WORKFLOW.md](WORKFLOW.md). 

## Tests
See [tests/README.md](tests/README.md).

## References and libraries
- Express.js, Vite.js, http-proxy-middleware, KubiosCloud and Tailwind documentation.
- ChatGPT.
- Graphs are rendered by Chart.js.

## Images

![Dashboard](/assets/images/dashboard.png) ![Diary](/assets/images/diary.png) ![Settings](/assets/images/settings.png)
![Landing](/assets/images/landing.png) ![Register](/assets/images/register.png)
