import React, { useMemo, useState, useEffect } from 'react';
import { useTable } from 'react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCircle } from '@fortawesome/free-solid-svg-icons';

const LogList = ({ carLogData, isLogDelete, selectedLogPos, setSelectedLogPos, selectedLogInfo, setSelectedLogInfo }) => {
  
  // 페이지 로드 시 selectedLogs 초기화
  useEffect(() => {
    const initialSelectedLogs = {};
    Object.keys(carLogData).forEach(car => {
      initialSelectedLogs[car] = carLogData[car].map(logItem => logItem.checked);
    });
    setSelectedLogPos(initialSelectedLogs);
  }, [carLogData]);

  // useMemo로 columns와 data를 최적화
  const columns = useMemo(() => [
    { Header: 'CAR 01', accessor: 'car01' },
    { Header: 'CAR 02', accessor: 'car02' },
    { Header: 'CAR 03', accessor: 'car03' },
    { Header: 'CAR 04', accessor: 'car04' },
    { Header: 'CAR 05', accessor: 'car05' },
    { Header: 'CAR 06', accessor: 'car06' },
    { Header: 'CAR 07', accessor: 'car07' },
    { Header: 'CAR 08', accessor: 'car08' },
    { Header: 'CAR 09', accessor: 'car09' },
    { Header: 'CAR 10', accessor: 'car10' },
  ], []);

  // data 준비 (각 차량의 로그를 배열 형태로 합친 데이터)
  const data = useMemo(() => {
    const maxLength = Math.max(
      ...Object.values(carLogData).map(car => car.length)
    );

    const rows = [];
    for (let i = 0; i < maxLength; i++) {
      const row = {};
      Object.keys(carLogData).forEach(car => {
        row[car] = carLogData[car][i] || { log: '', checked: false };
      });
      rows.push(row);
    }
    return rows;
  }, [carLogData]);

  const { getTableProps, getTableBodyProps, headerGroups, rows: tableRows, prepareRow } = useTable({
    columns,
    data, // 데이터 전달
  });

  // 체크박스 클릭 시 상태 토글
  const checkBoxClick = (rowIndex, colIndex) => {

  
    const carKeys = Object.keys(carLogData); // 차량 키들 (car01, car02, ..., car10)
    const carKey = carKeys[colIndex]; // 클릭된 차량의 키 (car01, car02, ...)
    
    console.log('체크된 로그 정보')
    const logItem = carLogData[carKey][rowIndex]; // carLogData에서 해당 위치의 로그
    console.log(logItem)

    if(logItem.checked==false){//첫클릭시일때 false이면 false->true이므로 삭제할 로그
      const updatedLogInfo=[...selectedLogInfo,logItem.log]
      setSelectedLogInfo(updatedLogInfo)
    }


    const updatedSelectedLogPos = { ...selectedLogPos };
    updatedSelectedLogPos[carKey][rowIndex] = !updatedSelectedLogPos[carKey][rowIndex];

    

    setSelectedLogPos(updatedSelectedLogPos);
  };

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="w-[97vw] m0 mx-auto" {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps()}
                  className="px-4 py-2 bg-blue-300 text-sm font-semibold text-center border-b border-gray-300"
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {tableRows.map((row, rowIndex) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell, colIndex) => {
                  const carKey = Object.keys(carLogData)[colIndex]; // 차량 키 (car01, car02, ...)
                  return (
                    <td
                      {...cell.getCellProps()}
                      className="px-4 py-2 text-sm text-center border-b border-gray-300"
                    >
                      <div>
                        {isLogDelete ? (
                          <FontAwesomeIcon
                            icon={selectedLogPos[carKey] && selectedLogPos[carKey][rowIndex] ? faCheckCircle : faCircle}
                            className="mt-2 text-gray-500 p-2 rounded cursor-pointer"
                            onClick={() => checkBoxClick(rowIndex, colIndex)} // 체크박스 클릭 시, 상태 토글
                          />
                        ) : null}
                        <span>{cell.value.log}</span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LogList;
