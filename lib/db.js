module.exports = function(config){
	var schema = require("jugglingdb").Schema,
		db = new schema(config.type, config),

	Framework = db.define("Framework", {
		id: {type: Number},
		name: {type: String, length: 255, index: true, null: false}
	}),

	Tag = db.define("Tag", {
		id: {type: Number},
		name: {type: String, length: 255, index: true, null: false}
	}),

	User = db.define("User", {
		id: {type: Number},
		name: {type: String, length: 255, index: true},
		email: {type: String, null: false, length: 255, index: true},
		password: {type: String, null: false, length: 255, index: true},
		points: {type: Number, default: 0},
		loginDate: {type: Date, default: Date.now},
		role: {type: String, default: "user"}
	}),

	Case = db.define("Case", {
		id: {type: Number},
		name: {type: String, index: true, null: false},
		code: {type: schema.Text, null: false},
		frameworkId: {type: Number, null: false},
		public: {type: Boolean, default: true},
		preload: {type: schema.Text},
		createdByUserId: {type: Number, null: false},
		createdDate: {type: Date, default: Date.now},
		modifiedByUserId: {type: Number},
		modifiedDate: {type: Date, default: Date.now},
		votes: {type: Number},
		status: {type: String, default: "active"}
	}),

	CaseTag = db.define("CaseTag", {
		id: {type: Number},
		caseId: {type: Number},
		tagId: {type: Number}
	});

	// Relations for CaseTag
	CaseTag.belongsTo(Case, {as: "case", foreignKey: "caseId"});
	CaseTag.belongsTo(Tag, {as: "tag", foreignKey: "tagId"});

	// Relations for Case
	Case.belongsTo(User, {as: "createdBy", foreignKey: "createdByUserId"});
	Case.belongsTo(User, {as: "modifiedBy", foreignKey: "modifiedByUserId"});
	Case.belongsTo(Framework, {as: "framework", foreignKey: "frameworkId"});
	Case.hasMany(CaseTag, {as: "caseTags", foreignKey: "caseId"});

	// Validation rules
	Framework.validatesInclusionOf("name", {message: "Framework is not unique"});
	Tag.validatesUniquenessOf("name", {message: "Tag is not unique"});
	User.validatesUniquenessOf("email", {message: "Email is not unique"});
	User.validatesInclusionOf("role", {in: ["user", "moderator", "administrator"]});

	Case.validatesInclusionOf("status", {in: ["active", "deleted"]});
	Case.validatesPresenceOf("frameworkId", {message: "Framework is not specified."});
	Case.validatesPresenceOf("createdByUserId", {message: "You are not authorized to perform this action."});

	// migration
	if(config.automigrate){
		db.automigrate();
	}

	// Exports
	return {
		Framework: Framework,
		Tag: Tag,
		User: User,
		Case: Case,
		CaseTag: CaseTag,

		resolveModel: function(name){
			name = (name + "").toLowerCase();
			for(var key in this){
				if(this.hasOwnProperty(key) && key.toLowerCase() === name){
					return this[key];
				}
			}
		}
	};
};