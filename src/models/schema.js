export const schema = {
  models: {
    Question: {
      name: "Question",
      fields: {
        id: { name: "id", isArray: false, type: "ID", isRequired: true, attributes: [] },
        title: { name: "title", isArray: false, type: "String", isRequired: true, attributes: [] },
        body: { name: "body", isArray: false, type: "String", isRequired: false, attributes: [] },
        answer: { name: "answer", isArray: false, type: "String", isRequired: false, attributes: [] },
        createdAt: { name: "createdAt", isArray: false, type: "AWSDateTime", isRequired: false, attributes: [], isReadOnly: true },
        updatedAt: { name: "updatedAt", isArray: false, type: "AWSDateTime", isRequired: false, attributes: [], isReadOnly: true }
      },
      syncable: true,
      pluralName: "Questions",
      attributes: [{ type: "model", properties: {} }]
    }
  },
  enums: {},
  nonModels: {},
  codegenVersion: "3.4.4",
  version: "question-schema-001"
};
