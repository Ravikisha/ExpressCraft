![ExpressCraft Logo](./assets/logo.png)
ExpressCraft is a command-line tool that allows you to quickly generate an Express application scaffold, getting you up and running with a basic Express server structure in no time.

<img src="https://img.shields.io/github/license/ravikisha/expresscraft" alt="License">
<img src="https://img.shields.io/github/issues/ravikisha/expresscraft" alt="Issues">
<img src="https://img.shields.io/github/forks/ravikisha/expresscraft" alt="Forks">
<img src="https://img.shields.io/github/stars/ravikisha/expresscraft" alt="Stars">
<img src="https://img.shields.io/github/issues-pr/ravikisha/expresscraft" alt="Pull Requests">



## Installation

To use ExpressCraft, make sure you have Node.js and npm installed on your system. Then, you can install it globally using npm:

```bash
npm install -g expresscraft
```

## Usage

To generate a new Express application, simply run the following command:

```bash
npx expresscraft create ExpressCraft
```

Replace "ExpressCraft" with the name of your desired application.

This command will create a new directory named "ExpressCraft" containing a basic Express application structure with the following files:

- `app.js`: The main entry point of the Express application.
- `package.json`: The npm package file with dependencies pre-configured.
- `routes/index.js`: Sample route file.
- `views/index.ejs`: Sample view file.
- `public/`: Directory for static assets like CSS, JavaScript, and images.

## Getting Started

After generating your Express application, navigate into the project directory:

```bash
cd ExpressCraft
```

Then, you can install the dependencies:

```bash
npm install
```

To start the Express server, run:

```bash
npm start
```

By default, the server will run on port 3000. You can access your application by visiting [http://localhost:3000](http://localhost:3000) in your web browser.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request on the [GitHub repository](https://github.com/yourusername/expresscraft).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.