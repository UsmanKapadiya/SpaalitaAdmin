import React from 'react';
import './Table.css';


const Table = ({
  columns,
  data,
  tableClassName = '',
  theadClassName = '',
  tbodyClassName = '',
  trClassName = '',
  thClassName = '',
  tdClassName = '',
  noDataContent = 'No data available',
}) => {
  return (
    <div className="custom-table-container">
      <table className={tableClassName || 'custom-table'}>
        <thead className={theadClassName}>
          <tr className={trClassName}>
            {columns.map((col) => (
              <th
                key={col.key || col}
                className={typeof col.thClassName === 'string' ? col.thClassName : thClassName}
              >
                {col.label || col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={tbodyClassName}>
          {data.length === 0 ? (
            <tr className={trClassName}>
              <td colSpan={columns.length} style={{ textAlign: 'center' }}>{noDataContent}</td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={row.id || idx} className={trClassName}>
                {columns.map((col) => (
                  <td
                    key={col.key || col}
                    className={typeof col.tdClassName === 'string' ? col.tdClassName : tdClassName}
                  >
                    {col.render
                      ? col.render(row[col.key], row, idx)
                      : row[col.key || col]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
