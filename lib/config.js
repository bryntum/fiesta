module.exports = {
	http: {
		port: 3000,
		secret: "{1be52d45-ba2c-41f5-98ad-3784f2473f1f}"
	},
	db: {
		type: "mysql",
		host: process.env.FIESTA_MYSQL_HOST,
		username: process.env.FIESTA_MYSQL_USER,
		password: process.env.FIESTA_MYSQL_PASSWORD,
		database: "fiesta",
		automigrate: false
	}
};