var query = require("db/v4/query");
var producer = require("messaging/v4/producer");
var daoApi = require("db/v4/dao");

var dao = daoApi.create({
	table: "SURVEY_QUESTIONS",
	properties: [
		{
			name: "Id",
			column: "ID",
			type: "INTEGER",
			id: true,
		}, {
			name: "Title",
			column: "TITLE",
			type: "VARCHAR",
		}, {
			name: "Text",
			column: "TEXT",
			type: "VARCHAR",
		}, {
			name: "QuestionType",
			column: "QUESTIONTYPE",
			type: "INTEGER",
		}, {
			name: "Campaign",
			column: "CAMPAIGN",
			type: "INTEGER",
			required: true
		}]
});

exports.list = function(settings) {
	return dao.list(settings);
};

exports.get = function(id) {
	return dao.find(id);
};

exports.create = function(entity) {
	if (!entity.Campaign) {
		entity.Campaign = "1001";
	}
	var id = dao.insert(entity);
	triggerEvent("Create", {
		table: "SURVEY_QUESTIONS",
		key: {
			name: "Id",
			column: "ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	dao.update(entity);
	triggerEvent("Update", {
		table: "SURVEY_QUESTIONS",
		key: {
			name: "Id",
			column: "ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "SURVEY_QUESTIONS",
		key: {
			name: "Id",
			column: "ID",
			value: id
		}
	});
};

exports.count = function() {
	return dao.count();
};

exports.customDataCount = function() {
	var resultSet = query.execute("SELECT COUNT(*) AS COUNT FROM SURVEY_QUESTIONS");
	if (resultSet !== null && resultSet[0] !== null) {
		if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
			return resultSet[0].COUNT;
		} else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
			return resultSet[0].count;
		}
	}
	return 0;
};

function triggerEvent(operation, data) {
	producer.queue("survey-admin/Survey/Questions/" + operation).send(JSON.stringify(data));
}