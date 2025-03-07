import React, { useState, useEffect } from "react";
import DetailForm from "../DetailForm/DetailForm";
import ButtonGroup from "../ButtonGroup/ButtonGroup";
import Select from "../Select/Select";
import GeneralInput from "../GeneralInput/GeneralInput";
import IconDelete from "../../assets/icon/icon-delete-circle.svg";

const allCompassOptions = [
  { label: "북", value: "103001" },
  { label: "북동", value: "103002" },
  { label: "동", value: "103003" },
  { label: "남동", value: "103004" },
  { label: "남", value: "103005" },
  { label: "남서", value: "103006" },
  { label: "서", value: "103007" },
  { label: "북서", value: "103008" },
];

const DynamicForm = ({ index, onDelete, handleRoadInputChange, 
  //road info props
  road_id, name, crosswalk_length, crosswalk_width, traffic_light, incoming_direction, site_id, crosswalk,
  incoming_compass,outgoing_compass,incoming_lane_cnt, outgoing_lane_cnt,
  mapped_detector, mapped_vms, mapped_speaker
 }) => {
  
    const [directionValues, setDirectionValues] = useState({
      firstDirection: '',
      secondDirection: '',
      thirdDirection:'',
      fourthDirection:'',
      fifthDirection:'',
      sixthDirection:''
    });

    useEffect(() => {
      if (incoming_direction) {
        // "|" 기준으로 분리
        const directions = incoming_direction.split('|');

        setDirectionValues({
          firstDirection: directions[0] || '',  // 첫 번째 부분
          secondDirection: directions[1] || '',  // 두 번째 부분
          thirdDirection:directions[2] || '',  // 세 번째 부분
          fourthDirection:directions[3] || '',  // 네 번째 부분
          fifthDirection:directions[4] || '',  // 다섯 번째 부분
          sixthDirection:directions[5] || '',  // 여섯 번째 부분
        });
      }
    }, [incoming_direction]);


  // 조건에 맞춰 'outgoing_compass' 값을 제일 앞으로 옮기기
  const sortedOptions = (type,compass) => {
    console.log('sortedOptions')
    console.log(type)
    console.log(compass)
    // 1. `outgoing_compass`가 선택되어 있다면 그 값을 맨 앞에 배치
    const selectedOption = allCompassOptions.find(option => option.value === compass);
    const otherOptions = allCompassOptions.filter(option => option.value !== compass);
    
    console.log('selectedOption')
    console.log(selectedOption)
    console.log('otherOptions')
    console.log(otherOptions)

    // 2. `outgoing_compass` 값이 있다면 그 값을 앞에 두고 나머지 옵션은 뒤에 배치
    return selectedOption ? [selectedOption, ...otherOptions] : allCompassOptions;
  };

  // 진입 진행 방향 도엊ㄱ으로 생성
  const generateInputFields = () => {
    const fields = [];
    for (let i = 1; i <= incoming_lane_cnt; i++) {
      fields.push(
        <GeneralInput
          inputFormStyle={"w-[100px]"}
          key={`incoming_direction_sub${i}`}  // key는 고유하게 설정
          customInput=""
          placeholder={`좌,우,직`}  // placeholder에 번호 추가
          name={`incoming_direction_sub${i}`}  // name을 동적으로 설정
          pattern="^(?!.*\d).*$"  // 숫자가 포함되지 않도록 하는 패턴
          onChange={handleRoadInputChange}
          value={directionValues[`incoming_direction_sub${i}`]}  // 동적으로 값을 바인딩
        />
      );
    }
    return fields;
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-[50px]">
        <div className="w-full grid col-span-1">
          <div className="flex flex-row items-start gap-[20px]">
            <div
              className="_boxImgDelete w-fit cursor-pointer hover:opacity-80"
              onClick={() => onDelete()}
            >
              <img src={IconDelete} alt="" />
            </div>
            <div className="flex w-full items-center flex-col gap-[12px]">
              <div className="flex w-full flex-row gap-x-4">
                <DetailForm
                  className="items-center!"
                  styleLabel="w-[124px]!"
                  label="접근로 ID "
                  name="road_id"
                  disabled={true}
                  value={road_id}
                  onChange={handleRoadInputChange}
                />
              </div>
              <div className="flex w-full flex-row gap-x-4">
                <DetailForm
                  className="items-center!"
                  label="진입/진출 차선 수"
                  required={true}
                  styleLabel="w-[124px]!"
                  showInput={false}
                  
                >
                  <div className="flex w-full flex-row gap-x-2">
                    <DetailForm
                      inputType="select"
                      className="items-center!"
                      label="유형"
                      showTitle={false}
                      required={true}
                      optionSelect={[
                        { label: 10, value: 10 },
                        { label: 9, value: 9 },
                        { label: 8, value: 8 },
                        { label: 7, value: 7 },
                        { label: 6, value: 6 },
                        { label: 5, value: 5 },
                        { label: 4, value: 4 },
                        { label: 3, value: 3 },
                        { label: 2, value: 2 },
                        { label: 1, value: 1 },
                      ]}
                      //onChange={(e) => console.log("Selected:", e.target.value)}
                      name="incoming_lane_cnt"
                      value={incoming_lane_cnt || 2}
                      onChange={handleRoadInputChange}
                    />
                    <DetailForm
                      inputType="select"
                      className="items-center!"
                      label="유형"
                      showTitle={false}
                      required={true}
                      optionSelect={[
                        { label: 10, value: 10 },
                        { label: 9, value: 9 },
                        { label: 8, value: 8 },
                        { label: 7, value: 7 },
                        { label: 6, value: 6 },
                        { label: 5, value: 5 },
                        { label: 4, value: 4 },
                        { label: 3, value: 3 },
                        { label: 2, value: 2 },
                        { label: 1, value: 1 },
                      ]}
                      //onChange={(e) => console.log("Selected:", e.target.value)}
                      name="outgoing_lane_cnt"
                      value={outgoing_lane_cnt || 2}
                      onChange={handleRoadInputChange}
                    />
                  </div>
                </DetailForm>
              </div>
              <div className="flex w-full flex-row gap-x-4">
                <DetailForm
                  className="items-center!"
                  label="횡단보도 유무"
                  required={true}
                  styleLabel="w-[124px]!"
                  showInput={false}
                >
                  <div className="flex w-full flex-row gap-x-2">
                    <DetailForm
                      inputType="select"
                      className="items-center!"
                      label="유형"
                      showTitle={false}
                      required={true}
                      name="crosswalk"
                      optionSelect={  crosswalk=='105001'?
                      [
                        { label: "존재", value: "105001" },
                        { label:"미존재", value:"105002"}
                      ]:
                      [
                        { label: "미존재", value: "105002" },
                        { label:"존재", value:"105001"}
                      ]}
                      value={crosswalk || "105002" } // 기본값 "미존재" 선택
                      onChange={handleRoadInputChange}
                      //onChange={(e) => console.log("Selected:", e.target.value)}
                    />
                  </div>
                </DetailForm>
              </div>
              <DetailForm
                className="items-center!"
                styleLabel="w-[124px]!"
                label="매핑 검지기"
                //placeholder="DT01001(ID0003)"
                value={mapped_detector || ""}
                name="mapped_detector"
                disabled={true}
                onChange={handleRoadInputChange}
              />
            </div>
          </div>
        </div>

        <div className="col-span-2 w-full gap-y-[12px] grid items-start">
          <div className="grid grid-cols-2 gap-[50px]">
            <div className="flex flex-row items-center gap-[20px]">
              <div className="flex w-full flex-row gap-x-4">
                <DetailForm
                  className="items-center!"
                  styleLabel=""
                  label="명칭 "
                  required={true}
                  placeholder="북쪽 접근로"
                  name="name"
                  maxLength={100}
                  value={name}
                  onChange={handleRoadInputChange}
                />
              </div>
            </div>
            <div className="flex flex-row items-center gap-[20px]">
              <div className="flex w-full flex-row gap-x-4">
                <DetailForm
                  className="items-center!"
                  label="진입/진출 방향"
                  required={true}
                  showInput={false}
                >
                  <div className="flex w-full flex-row gap-x-2">
                    <DetailForm
                      inputType="select"
                      className="items-center!"
                      showTitle={false}
                      required={true}
                      optionSelect={sortedOptions('incoming',incoming_compass)}  // 동적으로 옵션 순서 조정
                      //onChange={(e) => console.log("Selected:", e.target.value)}
                      name="incoming_compass"
                      value={incoming_compass || "103001"}
                      onChange={handleRoadInputChange}
                    />
                    <DetailForm
                      inputType="select"
                      className="items-center!"
                      showTitle={false}
                      required={true}
                      optionSelect={sortedOptions('outgoing',outgoing_compass)}  // 동적으로 옵션 순서 조정
                      //onChange={(e) => console.log("Selected:", e.target.value)}
                      name="outgoing_compass"
                      value={outgoing_compass || "103002" }
                      onChange={handleRoadInputChange}
                    />
                  </div>
                </DetailForm>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-row gap-x-4">
            <DetailForm
              className="items-center!"
              label="진입 진행 방향"
              required={true}
              showInput={false}
            >
              <div className="flex w-full flex-row gap-x-2">
                {generateInputFields()}
              </div>
            </DetailForm>
          </div>

          <div className="grid grid-cols-2 gap-[50px]">
            <div className="flex flex-row items-center gap-[20px]">
              <div className="flex w-full flex-row gap-x-4">
                <DetailForm
                  className="items-center!"
                  label="횡단 보도 길이 / 폭"
                  name="crosswalk"
                  required={true}
                  showInput={false}
                >
                  <div className="flex w-full flex-row gap-x-2">
                    <GeneralInput 
                      customInput="w-full" 
                      placeholder="5m" 
                      name="crosswalk_length" 
                      pattern="^[0-9]*\.?[0-9]*$" // 숫자와 온점만 허용하는 정규식
                      title="숫자와 온점만 입력 가능합니다." // 사용자가 잘못된 값을 입력할 경우 안내
                      disabled={crosswalk=='105002'? true:false}
                      onChange={handleRoadInputChange} value={crosswalk_length}/>
                    <GeneralInput 
                      customInput="w-full" 
                      placeholder="2.5m" 
                      name="crosswalk_width" 
                      pattern="^[0-9]*\.?[0-9]*$" // 숫자와 온점만 허용하는 정규식
                      title="숫자와 온점만 입력 가능합니다." // 사용자가 잘못된 값을 입력할 경우 안내
                      disabled={crosswalk=='105002'? true:false}
                      onChange={handleRoadInputChange} value={crosswalk_width}/>
                  </div>
                </DetailForm>
              </div>
            </div>
            <div className="flex flex-row items-center gap-[20px]">
              <div className="flex w-full flex-row gap-x-4">
                <DetailForm
                  className="items-center!"
                  label="보행자 신호등 유무"
                  required={true}
                  showInput={false}
                  name="traffic_light" 
                >
                  <div className="flex w-full flex-row gap-x-2">
                    <DetailForm
                      inputType="select"
                      className="items-center!"
                      name="traffic_light" 
                      showTitle={false}
                      required={true}
                      optionSelect={  traffic_light=='106001'?
                        [
                          { label: "존재", value: "106001" },
                          { label:"미존재", value:"106002"}
                        ]:
                        [
                          { label: "미존재", value: "106002" },
                          { label:"존재", value:"106001"}
                        ]}
                        value={traffic_light || "106002" }
                        onChange={handleRoadInputChange}
                    />
                  </div>
                </DetailForm>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-[50px]">
            <div className="flex flex-row items-center gap-[20px]">
              <div className="flex w-full flex-row gap-x-4">
                <DetailForm 
                  className="items-center!" 
                  label="매핑 전광판" 
                  name="mapped_vms" 
                  //placeholder="DT01001(ID0003)"
                  disabled={true}
                  onChange={handleRoadInputChange} 
                  value={mapped_vms}
                />
              </div>
            </div>
            <div className="flex flex-row items-center gap-[20px]">
                <DetailForm 
                  className="items-center!" 
                  label="매핑 스피커" 
                  name="mapped_speaker" 
                  //placeholder="DT01001(ID0003)"
                  disabled={true}
                  onChange={handleRoadInputChange} 
                  value={mapped_speaker}
                />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DynamicForm;
