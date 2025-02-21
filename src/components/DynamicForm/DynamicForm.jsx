import React, { useState } from "react";
import DetailForm from "../DetailForm/DetailForm";
import ButtonGroup from "../ButtonGroup/ButtonGroup";
import Select from "../Select/Select";
import GeneralInput from "../GeneralInput/GeneralInput";
import IconDelete from "../../assets/icon/icon-delete-circle.svg";
const DynamicForm = ({ index, onDelete, handleRoadInputChange }) => {
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
                        { label: "6", value: "number" },
                        { label: "5", value: "number" },
                      ]}
                      //onChange={(e) => console.log("Selected:", e.target.value)}
                      name="incoming_compass"
                      onChange={handleRoadInputChange}
                    />
                    <DetailForm
                      inputType="select"
                      className="items-center!"
                      label="유형"
                      showTitle={false}
                      required={true}
                      optionSelect={[
                        { label: "6", value: "number" },
                        { label: "5", value: "number" },
                      ]}
                      //onChange={(e) => console.log("Selected:", e.target.value)}
                      name="outgoing_compass"
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
                      optionSelect={[{ label: "존재", value: "site name" }]}
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
                      optionSelect={[{ label: "북", value: "number" }]}
                      //onChange={(e) => console.log("Selected:", e.target.value)}
                      name="incoming_compass"
                      onChange={handleRoadInputChange}
                    />
                    <DetailForm
                      inputType="select"
                      className="items-center!"
                      showTitle={false}
                      required={true}
                      optionSelect={[
                        { label: "남서", value: "number" },
                        // { label: "5", value: "number" },
                      ]}
                      //onChange={(e) => console.log("Selected:", e.target.value)}
                      name="outgoing_compass"
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
                <GeneralInput customInput="w-full" placeholder="좌, 직" name="incoming_direction_sub1" onChange={handleRoadInputChange}/>
                <GeneralInput customInput="w-full" placeholder="좌, 직" name="incoming_direction_sub2" onChange={handleRoadInputChange}/>
                <GeneralInput customInput="w-full" placeholder="좌, 직" name="incoming_direction_sub3" onChange={handleRoadInputChange}/>
                <GeneralInput customInput="w-full" placeholder="좌, 직" name="incoming_direction_sub4" onChange={handleRoadInputChange}/>
                <GeneralInput customInput="w-full" placeholder="좌, 직" name="incoming_direction_sub5" onChange={handleRoadInputChange}/>
                <GeneralInput customInput="w-full" placeholder="좌, 직" name="incoming_direction_sub6" onChange={handleRoadInputChange}/>
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
                    <GeneralInput customInput="w-full" placeholder="5m" name="crosswalk_length" onChange={handleRoadInputChange}/>
                    <GeneralInput customInput="w-full" placeholder="2.5m" name="corsswalk_width" onChange={handleRoadInputChange}/>
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
                <DetailForm className="items-center!" label="사이트 ID" name="related_site_id1" onChange={handleRoadInputChange}/>
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
