import React, { useState, useEffect } from "react";
import DetailForm from "../DetailForm/DetailForm";
import ButtonGroup from "../ButtonGroup/ButtonGroup";
import Select from "../Select/Select";
import GeneralInput from "../GeneralInput/GeneralInput";
import IconDelete from "../../assets/icon/icon-delete-circle.svg";

const DynamicForm = ({ index, onDelete, handleRoadInputChange, 
  //road info props
  road_id, name, crosswalk_length, crosswalk_width, incoming_direction, site_id, crosswalk,
  incoming_compass,outgoing_compass,incoming_lane_cnt, outgoing_lane_cnt
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


  return (
    <>
      <div className="grid grid-cols-3 gap-[50px]">
        <div className="w-full grid col-span-1">
          <div className="flex flex-row items-start gap-[20px]">
            <div
              className="_boxImgDelete w-fit"
              onClick={() => onDelete(index)}
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
                      name="incoming_compass"
                      value={incoming_lane_cnt}
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
                      name="outgoing_compass"
                      value={outgoing_lane_cnt}
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
                  name="crosswalk"
                  onChange={handleRoadInputChange}
                >
                  <div className="flex w-full flex-row gap-x-2">
                    <DetailForm
                      inputType="select"
                      className="items-center!"
                      label="유형"
                      showTitle={false}
                      required={true}
                      optionSelect={  crosswalk=='105001'?
                      [
                        { label: "존재", value: "105001" },
                        { label:"미존재", value:"105002"}
                      ]:
                      [
                        { label: "미존재", value: "105002" },
                        { label:"존재", value:"105001"}
                      ]}
                      onChange={(e) => console.log("Selected:", e.target.value)}
                    />
                  </div>
                </DetailForm>
              </div>
              <DetailForm
                className="items-center!"
                styleLabel="w-[124px]!"
                label="매핑 검지기"
                placeholder="DT01001(ID0003)"
                name="mapping_detector"
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
                  placeholder="북쪽 접근로"
                  name="road_name"
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
                      optionSelect={[
                        { label: "북", value: "103001" },
                        { label: "북동", value: "103002" },
                        { label: "동", value: "103003" },
                        { label: "남동", value: "103004" },
                        { label: "남", value: "103005" },
                        { label: "남서", value: "103006" },
                        { label: "서", value: "103007" },
                        { label: "북서", value: "103008" }
                      ]}
                      //onChange={(e) => console.log("Selected:", e.target.value)}
                      name="incoming_compass"
                      value={incoming_compass}
                      onChange={handleRoadInputChange}
                    />
                    <DetailForm
                      inputType="select"
                      className="items-center!"
                      showTitle={false}
                      required={true}
                      optionSelect={[
                        { label: "북", value: "103001" },
                        { label: "북동", value: "103002" },
                        { label: "동", value: "103003" },
                        { label: "남동", value: "103004" },
                        { label: "남", value: "103005" },
                        { label: "남서", value: "103006" },
                        { label: "서", value: "103007" },
                        { label: "북서", value: "103008" }
                      ]}
                      //onChange={(e) => console.log("Selected:", e.target.value)}
                      name="outgoing_compass"
                      value={outgoing_compass}
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
              label="위도 / 경도"
              required={true}
              showInput={false}
            >
              <div className="flex w-full flex-row gap-x-2">
                <GeneralInput customInput="w-full" placeholder="좌, 직" name="incoming_direction_sub1" onChange={handleRoadInputChange} value={directionValues.firstDirection}/>
                <GeneralInput customInput="w-full" placeholder="좌, 직" name="incoming_direction_sub2" onChange={handleRoadInputChange} value={directionValues.secondDirection}/>
                <GeneralInput customInput="w-full" placeholder="좌, 직" name="incoming_direction_sub3" onChange={handleRoadInputChange} value={directionValues.thirdDirection}/>
                <GeneralInput customInput="w-full" placeholder="좌, 직" name="incoming_direction_sub4" onChange={handleRoadInputChange} value={directionValues.fourthDirection}/>
                <GeneralInput customInput="w-full" placeholder="좌, 직" name="incoming_direction_sub5" onChange={handleRoadInputChange} value={directionValues.fifthDirection}/>
                <GeneralInput customInput="w-full" placeholder="좌, 직" name="incoming_direction_sub6" onChange={handleRoadInputChange} value={directionValues.sixthDirection}/>
              </div>
            </DetailForm>
          </div>

          <div className="grid grid-cols-2 gap-[50px]">
            <div className="flex flex-row items-center gap-[20px]">
              <div className="flex w-full flex-row gap-x-4">
                <DetailForm
                  className="items-center!"
                  label="횡단 보도 길이 / 폭"
                  required={true}
                  showInput={false}
                >
                  <div className="flex w-full flex-row gap-x-2">
                    <GeneralInput customInput="w-full" placeholder="5m" name="crosswalk_length" onChange={handleRoadInputChange} value={crosswalk_length}/>
                    <GeneralInput customInput="w-full" placeholder="2.5m" name="corsswalk_width" onChange={handleRoadInputChange} value={crosswalk_width}/>
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
                  onChange={handleRoadInputChange}
                >
                  <div className="flex w-full flex-row gap-x-2">
                    <DetailForm
                      inputType="select"
                      className="items-center!"
                      showTitle={false}
                      required={true}
                      optionSelect={[{ label: "북", value: "number" }]}
                      onChange={(e) => console.log("Selected:", e.target.value)}
                    />
                  </div>
                </DetailForm>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-[50px]">
            <div className="flex flex-row items-center gap-[20px]">
              <div className="flex w-full flex-row gap-x-4">
                <DetailForm className="items-center!" label="사이트 ID" name="related_site_id1" onChange={handleRoadInputChange} value={site_id}/>
              </div>
            </div>
            <div className="flex flex-row items-center gap-[20px]">
                <DetailForm className="items-center!" label="사이트 ID" name="related_site_id2" onChange={handleRoadInputChange}/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DynamicForm;
