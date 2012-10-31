module.exports = {
	http: {
		port: 3000,
		secret: "{1be52d45-ba2c-41f5-98ad-3784f2473f1f}"
	},
	db: {
		type: "mysql",
		host: "localhost",
		username: "root",
		password: "root",
		database: "fiesta",
		automigrate: false
	}
};