import { openDb } from "../configDB.js";

export async function createTable() {
  openDb().then((db:any) =>
    db.exec(
      "CREATE TABLE IF NOT EXISTS Csv( filepath varchar PRIMARY KEY, userId varchar,filename varchar)"
    )
  );
}

export async function insert(userId:string, filename:string, filepath:string) {
  openDb().then((db:any) =>
    db.run(
      `Insert into Csv (filepath,userId,filename) values ('${filepath}','${userId}','${filename}');`
    )
  );
}

export async function getRecentCsv(userId:string) {
   await openDb()
    .then((db:any) => db.all(` Select * from Csv where Csv.idUser='${userId}';`))
    .then((rows:string) => rows);
}
