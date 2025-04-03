import React, { useMemo, useState, useEffect } from 'react';
import { useTable } from 'react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCircle } from '@fortawesome/free-solid-svg-icons';

const LogList = (
  { deviceIds, deviceLogData, isLogDelete, 
    selectedLogPos, setSelectedLogPos, 
    selectedLogInfo, setSelectedLogInfo }) => {

  // 페이지 로드 시 selectedLogs 초기화
  useEffect(() => {
    console.log('LogList Data');
    console.log(deviceLogData);
  }, [deviceLogData]);

  // 동적으로 컬럼 생성: deviceIds 기반으로
  const columns = useMemo(() => {
    return deviceIds.map((deviceId, index) => ({
      Header: `${deviceId}`, // CAR ID를 4자리로 포맷 (예: 0001, 0002, ...)
      accessor: `car${index.toString().padStart(2, '0')}`, // car01, car02, ...
    }));
  }, [deviceIds]);

  // 데이터 준비: deviceLogData 배열 그대로 사용
  const data = useMemo(() => {
    return deviceLogData.map((log, index) => ({
      car00: log.car00 || '',
      car01: log.car01 || '', 
      car02: log.car02 || '', 
      car03: log.car03 || '', 
      car04: log.car04 || '', 
      car05: log.car05 || '',
      car06: log.car06 || '',
      car07: log.car07 || '',
      car08: log.car08 || '',
      car09: log.car09 || '',
      //car10: log.car10 || ''
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
    if (!logItem || !logItem.log_file_name) {
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
        if (!updatedLogInfo.includes(logItem.log_file_id)) {
          updatedLogInfo.push(logItem.log_file_id);
        }
      } else {
        // 체크 해제 시 test_id 제거
        const index = updatedLogInfo.indexOf(logItem.log_file_id);
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
