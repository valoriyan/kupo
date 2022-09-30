"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTableConstraints = void 0;
function getUniqueConstraintsOfTable({ tableName, pool, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = {
            text: `
      SELECT
        conname as name_of_constraint,
        -- conkey,
        pg_get_constraintdef(pg_constraint.oid) as constraint_definition
      FROM
        pg_constraint
      INNER JOIN
        pg_class
          ON
            pg_class.oid = pg_constraint.conrelid
      INNER JOIN
        pg_attribute
          ON
          pg_attribute.attrelid = pg_class.oid
      LEFT JOIN
        pg_index
          ON
              pg_index.indrelid = pg_class.oid
            AND
              pg_attribute.attnum = ANY (pg_index.indkey[0:(pg_index.indnkeyatts - 1)])
      WHERE
          conrelid = $1 ::regclass::oid
        AND
          pg_index.indisunique IS TRUE
        AND
          pg_attribute.attnum > 0 -- not a system column
        AND
          contype='u'
      GROUP BY
        name_of_constraint,
        constraint_definition
      ;
    `,
            values: [tableName],
        };
        const response = yield pool.query(query);
        const rows = response.rows;
        return _mapConstraintsByKeys(rows);
    });
}
function getForeignKeysOfTable({ tableName, pool, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = {
            text: `
      SELECT
        conname AS name_of_constraint,
        pg_get_constraintdef(oid) AS constraint_definition
      FROM
        pg_constraint
      WHERE
          contype IN ('f')
        AND
          connamespace = 'public'::regnamespace  -- your schema here
        AND
          conrelid::regclass = (SELECT oid FROM pg_class WHERE relname = $1)
      ORDER BY
        conrelid::regclass::text,
        contype
      DESC
      ;
   `,
            values: [tableName],
        };
        const response = yield pool.query(query);
        const rows = response.rows;
        return _mapConstraintsByKeys(rows);
    });
}
function getPrimaryKeysOfTable({ tableName, pool, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = {
            text: `
      SELECT
        conname AS name_of_constraint,
        pg_get_constraintdef(oid) AS constraint_definition
      FROM
        pg_constraint
      WHERE
          contype IN ('p ')
        AND
          connamespace = 'public'::regnamespace  -- your schema here
        AND
          conrelid::regclass = (SELECT oid FROM pg_class WHERE relname = $1)
      ORDER BY
        conrelid::regclass::text,
        contype
      DESC
      ;
   `,
            values: [tableName],
        };
        const response = yield pool.query(query);
        const rows = response.rows;
        return _mapConstraintsByKeys(rows);
    });
}
function getTableConstraints({ tableName, pool, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const foreignKeyConstraints = yield getForeignKeysOfTable({
            tableName,
            pool,
        });
        const primaryKeyConstraints = yield getPrimaryKeysOfTable({
            tableName,
            pool,
        });
        const uniqueIndexConstraints = yield getUniqueConstraintsOfTable({
            tableName,
            pool,
        });
        return {
            foreignKeyConstraints,
            primaryKeyConstraints,
            uniqueIndexConstraints,
        };
    });
}
exports.getTableConstraints = getTableConstraints;
function _mapConstraintsByKeys(constraints) {
    return constraints.reduce((accum, constraint) => {
        return Object.assign(Object.assign({}, accum), { [constraint.name_of_constraint]: constraint });
    }, {});
}
//# sourceMappingURL=getTableConstraints.js.map