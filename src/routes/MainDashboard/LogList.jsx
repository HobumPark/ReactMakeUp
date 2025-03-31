import React, { useMemo, useState, useEffect } from 'react';
import { useTable } from 'react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCircle } from '@fortawesome/free-solid-svg-icons';

const LogList = (
  { deviceLogData, isLogDelete, 
    selectedLogPos, setSelectedLogPos, 
    selectedLogInfo, setSelectedLogInfo }) => {

  // 페이지 로드 시 selectedLogs 초기화
  useEffect(() => {
    console.log('LogList Data');
    console.log(deviceLogData);
  }, [deviceLogData]);

  // columns 설정 (CAR 01, CAR 02, CAR 03 ...)
  const columns = useMemo(() => [
    { Header: 'CAR 01', accessor: 'car1' },
    { Header: 'CAR 02', accessor: 'car2' },
    { Header: 'CAR 03', accessor: 'car3' },
    { Header: 'CAR 04', accessor: 'car4' },
    { Header: 'CAR 05', accessor: 'car5' },
    { Header: 'CAR 06', accessor: 'car6' },
    { Header: 'CAR 07', accessor: 'car7' },
    { Header: 'CAR 08', accessor: 'car8' },
    { Header: 'CAR 09', accessor: 'car9' },
    { Header: 'CAR 10', accessor: 'car10' },
  ], []);

  // 데이터 준비: deviceLogData 배열 그대로 사용
  const data = useMemo(() => {
    return deviceLogData.map((log, index) => ({
      car1: log.car1,
      car2: log.car2,
      car3: log.car3,
      car4: log.car4 || '', 
      car5: log.car5 || '',
      car6: log.car6 || '',
      car7: log.car7 || '',
      car8: log.car8 || '',
      car9: log.car9 || '',
      car10: log.car10 || ''
    }));
  }, [deviceLogData]);

  const { getTableProps, getTableBodyProps, headerGroups, rows: tableRows, prepareRow } = useTable({
    columns,
    data, 
  });

  // 체크박스 클릭 시 상태 토글
  const checkBoxClick = (rowIndex, colIndex) => {
    const carKeys = Object.keys(deviceLogData);
    const carKey = carKeys[colIndex]; // 클릭된 차량의 키 (car1, car2, ...)
  
    // 해당 차량의 해당 row의 로그 항목을 가져옵니다
    const logItem = deviceLogData[rowIndex]?.[carKey];
    console.log('logItem');
    console.log(logItem);
  
    // 선택된 로그 상태 업데이트
    const updatedSelectedLogPos = { ...selectedLogPos };
    updatedSelectedLogPos[carKey] = updatedSelectedLogPos[carKey] || [];
    updatedSelectedLogPos[carKey][rowIndex] = !updatedSelectedLogPos[carKey][rowIndex];
  
    setSelectedLogPos(updatedSelectedLogPos);
  
    // 여기에 로그 아이디를 selectedLogInfo로 업데이트
    // 예: logItem.id가 로그의 고유 ID라면 아래처럼 할 수 있습니다
    if (logItem && logItem.id) {
      setSelectedLogInfo((prevState) => {
        const updatedLogInfo = [...prevState];
        if (updatedSelectedLogPos[carKey][rowIndex]) {
          // 체크한 경우 로그 아이디 추가
          updatedLogInfo.push(logItem.id);
        } else {
          // 체크 해제 시 로그 아이디 제거
          const index = updatedLogInfo.indexOf(logItem.id);
          if (index > -1) {
            updatedLogInfo.splice(index, 1);
          }
        }
        return updatedLogInfo;
      });
    }
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
                  const carKey = Object.keys(deviceLogData)[colIndex]; // 차량 키 (car1, car2, ...)
                  console.log('cell value');
                  console.log(cell.value); 

                  return (
                    <td
                      {...cell.getCellProps()}
                      className="px-4 py-2 text-sm text-center border-b border-gray-300"
                    >
                      <div className="flex items-center justify-center h-[30px]">
                        {isLogDelete && cell.value && (  // Only show checkbox if value exists
                          <FontAwesomeIcon
                            icon={selectedLogPos[carKey] && selectedLogPos[carKey][rowIndex] ? faCheckCircle : faCircle}
                            className="mt-2 text-2xl text-gray-500 p-2 rounded cursor-pointer"
                            onClick={() => checkBoxClick(rowIndex, colIndex)} // 체크박스 클릭 시, 상태 토글
                          />
                        )}
                        {/* Display the value or a placeholder */}
                        <span className="ml-2">
                          {cell.value ? `${cell.value}번 로그` : ''}                   
                        </span> 
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
