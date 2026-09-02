/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2382559930")

  // add field
  collection.fields.addAt(9, new Field({
    "help": "",
    "hidden": false,
    "id": "number1923228126",
    "max": null,
    "min": 0,
    "name": "price_large",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text3187440571",
    "max": 40,
    "min": 0,
    "name": "size_small_label",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text3346107401",
    "max": 40,
    "min": 0,
    "name": "size_large_label",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // update field
  collection.fields.addAt(4, new Field({
    "help": "",
    "hidden": false,
    "id": "select105650625",
    "maxSelect": 1,
    "name": "category",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "susi_seti",
      "aukstie_susi",
      "siltie_susi",
      "burgeri",
      "nigiri",
      "uzkodas",
      "merces",
      "dzerieni"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2382559930")

  // remove field
  collection.fields.removeById("number1923228126")

  // remove field
  collection.fields.removeById("text3187440571")

  // remove field
  collection.fields.removeById("text3346107401")

  // update field
  collection.fields.addAt(4, new Field({
    "help": "",
    "hidden": false,
    "id": "select105650625",
    "maxSelect": 1,
    "name": "category",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "rolli",
      "nigiri_sasimi",
      "poke",
      "uzkodas",
      "dzerieni",
      "deserti"
    ]
  }))

  return app.save(collection)
})
