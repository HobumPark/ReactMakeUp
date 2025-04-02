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
      car1: log.car1 || '', 
      car2: log.car2 || '', 
      car3: log.car3 || '', 
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

  const checkBoxClick = (rowIndex, colIndex) => {
    console.log('deviceLogData[rowIndex]');
    console.log(deviceLogData[rowIndex]);
    const carKeys = Object.keys(deviceLogData[rowIndex]);  // 해당 row에서 car 키 추출 (car1, car2, ...)
  
    // 클릭된 차량의 키 (car1, car2, ...)
    const carKey = carKeys[colIndex];
    console.log('rowIndex:', rowIndex);  // rowIndex 값 확인
    console.log('colIndex:', colIndex);  // colIndex 값 확인
    console.log('carKey:', carKey);      // carKey 값 확인
  
    // 해당 차량의 해당 row의 로그 항목을 가져옵니다
    const logItem = deviceLogData[rowIndex]?.[carKey];
    console.log('logItem for row', rowIndex, 'and carKey', carKey, ':', logItem);  // 데이터 확인
  
    // 로그 항목이 없는 경우
    if (!logItem || !logItem.test_id) {
      console.log('logItem is undefined or empty for row', rowIndex, 'and carKey', carKey);
      return;  // logItem이 없거나 test_id가 없다면 아무 작업도 하지 않음
    }
  
    // test_id를 alert로 표시
    //alert(`Selected test_id: ${logItem.test_id}`);
  
    // 선택된 로그 상태 업데이트
    const updatedSelectedLogPos = { ...selectedLogPos };
    updatedSelectedLogPos[carKey] = updatedSelectedLogPos[carKey] || [];
  
    // 체크 상태 토글 (기존 상태를 반전시킴)
    updatedSelectedLogPos[carKey][rowIndex] = !updatedSelectedLogPos[carKey][rowIndex];
  
    // 상태 업데이트
    setSelectedLogPos(updatedSelectedLogPos);
  
    // 여기에 test_id를 selectedLogInfo로 업데이트
    setSelectedLogInfo((prevState) => {
      const updatedLogInfo = [...prevState];
  
      // 체크한 경우 test_id 추가
      if (updatedSelectedLogPos[carKey][rowIndex]) {
        // test_id가 이미 배열에 있으면 추가하지 않음
        if (!updatedLogInfo.includes(logItem.test_id)) {
          updatedLogInfo.push(logItem.test_id);
        }
      } else {
        // 체크 해제 시 test_id 제거
        const index = updatedLogInfo.indexOf(logItem.test_id);
        if (index > -1) {
          updatedLogInfo.splice(index, 1); // test_id를 배열에서 제거
        }
      }
  
      return updatedLogInfo;
    });
  };
  
  
  
  return (
    <div className="overflow-x-auto bg-white shadow-md">
      <table className="w-[97vw] m0 mx-auto" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, colIndex) => (
                <th
                  {...column.getHeaderProps()}
                  className={`
                    px-4 py-2 bg-[#9cc8dc] text-[#135a78] text-sm font-semibold text-center border-b border-gray-300 
                    ${colIndex === 0 ? 'rounded-tl-lg' : ''}  // Apply top-left rounding to the first th
                    ${colIndex === headerGroup.headers.length - 1 ? 'rounded-tr-lg' : ''}  // Apply top-right rounding to the last th
                  `}
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
              <tr {...row.getRowProps()} className="border-l border-r border-gray-300"> 
                {row.cells.map((cell, colIndex) => {
                  const carKey = Object.keys(deviceLogData[0])[colIndex]; // 차량 키 (car1, car2, ...)
  
                  return (
                    <td
                      {...cell.getCellProps()}
                      className="px-4 py-2 text-sm text-center border-b border-gray-300 "
                    >
                      <div className="flex items-center justify-center h-[30px]">
                        {isLogDelete && cell.value.log_file_name && (
                          <FontAwesomeIcon
                            icon={selectedLogPos[carKey] && selectedLogPos[carKey][rowIndex] ? faCheckCircle : faCircle}
                            className="mt-2 text-2xl text-[#dadada] p-2 rounded cursor-pointer"
                            onClick={() => checkBoxClick(rowIndex, colIndex)} // 체크박스 클릭 시, 상태 토글
                          />
                        )}
                        <span className="ml-2">{cell.value ? `${cell.value.log_file_name}` : 'EMPTY'}</span>
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
