const excelRoutes = require('./excel');
const userRoutes = require('./users');

const constructorMethod = (app) => {
	app.use('/excel', excelRoutes);
	app.use('/user', userRoutes);

	app.use('*', (req, res) => {
		res.sendStatus(404);
	});
};

module.exports = constructorMethod;