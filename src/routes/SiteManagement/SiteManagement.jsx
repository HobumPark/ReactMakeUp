import React, { useState, useCallback, useRef, useEffect } from "react";
import ContainerCard from "../../components/ContainerCard/ContainerCard";
import Filtering from "../../components/Filtering/Filtering";
import { ReactTabulator } from "react-tabulator";
import DetailForm from "../../components/DetailForm/DetailForm";
import LogList from "../../components/LogList/LogList";
import ButtonGroup from "../../components/ButtonGroup/ButtonGroup";
import Select from "../../components/Select/Select";
import GeneralInput from "../../components/GeneralInput/GeneralInput";
import DynamicForm from "../../components/DynamicForm/DynamicForm";
import IconDelete from "../../assets/icon/icon-delete-circle.svg";
import useSiteMgt from '../../hooks/useSiteMgt';
import useRoadMgt from '../../hooks/useRoadMgt';
import NoticeMessage from "../../plugin/noticemessage/noticemessage"
import { useTranslation } from 'react-i18next';
import { useQueryClient } from "@tanstack/react-query";


//table set, text
const boxTabulator = [
  {
    title: "No",
    formatter: "rownum",
    width: 60,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "사이트 ID",
    field: "site_id",//snake case
    WidthGrow: 80,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "명칭",
    field: "name",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "주소",
    field: "address",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "위도",
    field: "lat",
    widthGrow: 0.5,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "경도",
    field: "lng",
    widthGrow: 0.5,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "접근로 수",
    field: "number_road",
    widthGrow: 0.5,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "업데이트 일시",
    field: "updated_time",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
];

//sample data
const data = [
  {
    site_id: "SITE00100",
    name: "삼성역 사거리 교차로",
    address: "서울시 강남구 삼성동",
    location: "5.55572383 / 5.55572383",
    no_approaches: "4",
    update_date: "2025-01-24 23:10:11",
  },
];


const SiteManagement = () => {
  const { t, i18n } = useTranslation();
  // queryClient 가져오기
  const queryClient = useQueryClient();

  const [queryParams, setQueryParams] = useState(""); // queryParams 상태
  const [siteId, setSiteId] = useState(null); // siteId 상태

  // site 데이터 가져오기
  const { siteListData, detailSiteData, deleteSite, updateSite, createSite } = useSiteMgt({
    queryParams: queryParams || "", siteId
  });
  console.log('useSiteMgt');
  console.log('siteListData');
  console.log(siteListData);
  console.log('detailSiteData');
  console.log(detailSiteData);

  const { roadListData, deleteRoad, error, isLoadingRoad } = useRoadMgt({
    queryParams: siteId ? `site_id=${siteId}` : null, // siteId가 있을 때만 API 호출
  });

  console.log('useRoadMgt');
  console.log(roadListData);
  console.log(isLoadingRoad);
  console.log(error);

  if(roadListData){
    console.log('roadListData')
    console.log(roadListData)
  }


  const [selectedOption, setSelectedOption] = useState("");
  const handleChange = (e) => {
    setSelectedOption(e.target.value);
  };
  const options = [
    { value: "전체", label: "전체" },
    { value: "교차로", label: "교차로" },
    { value: "횡단보도", label: "횡단보도" },
  ];

  const optionsTabulator = {
    selectableRows: 1,
    pagination: true,
    paginationSize: 10,
    rowHeight: 41,
    movableRows: false,
    resizableRows: false,
    footerElement: `<div style="padding: 0 20px 0 0; text-align: right;">총 ${siteListData?.data.length} 건</div>`,
    selectableRowsCheck:(row)=>{
      return !row.getElement().classList.contains("tabulator-selected")
    }
  };

  const logData = [
    { label: "등록자", value: "김철수" },
    { label: "등록 시간", value: "02-22-2022 12:02:47 " },
    { label: "수정자", value: "박철수" },
    { label: "수정 시간", value: "02-23-2022 12:02:47 " },
  ];

  //입력용 road 목록
  const [roadInputList, setRoadInputList] = useState([]);

  //add dynamic input form of road
  const addDynamicGroup = () => {

    if(siteFormValues?.number_road){

      const {number_road}=siteFormValues

        if(roadInputList.length >= number_road){
          alert('접근로 생성 최대 갯수를 넘을수 없습니다.')
          return
        }else{
          console.log('roadInputList')
          console.log(roadInputList)
          setRoadInputList([...roadInputList, roadInputList.length + 1]); 
        }

    }else{
      alert('접근로수를 입력하세요!')
      return
    }
    
  };

  // road list 삭제
  const deleteDynamicGroup = (mode, road_id) => {
    //alert('roadList delete')
    //const newGroupList = groupList.filter((_, i) => i !== index); 
    //setGroupList(newGroupList);
    //roadList delete button
    console.log('입력 모드:'+mode)
    console.log('접근로 아이디:'+road_id)

    if(mode == 'input_mode'){
      alert(road_id+" 번 접근로 단순 입력 목록 삭제")
      roadInputList
    }else if(mode == 'list_mode'){
      alert(road_id+" 번 접근로 삭제 API요청")
      deleteRoad(road_id)
      //삭제 성공후 선택했던 row다시 선택해서 삭제된것 사라지게
      const tempSiteId = siteId;
      setSiteId(null)
      setSiteId(tempSiteId)
    }
  };

  const [currentRoadNumber,setCurrentRoadNumber]=useState(0)
  //site input form values, row data to display
  const [siteFormValues, setSiteFormValues] = useState({
    site_id:'',
    name:'',
    address:'',
    lat:'',
    lng:'',
    type:'102001',
    type_value:'Intersection',
    number_road:'',
    mapping_box:'',
    description:'description'
  })

  //road data list related with site
  const [siteRelatedRoadList, setSiteRelatedRoadList] = useState([

  ])

  // select on change - intersection and crosswalk
  const handleSiteInputChange = (e) => {
    const { name, value } = e.target;
  
    // If the number_of_access_roads is being changed, reset the dynamic groups
    if (name === "number_road") {
      console.log("number_road")
      console.log(value)
      setSiteFormValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
      
      // Reset the group list whenever the number of access roads changes
      //setGroupList([]); // Reset all dynamic groups
    } else {
      setSiteFormValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }

    if (isNewClicked) {//new버튼 클릭했을때만
      setHasChangesCreate(true); 
    } else {
      setHasChangesUpdate(true); 
    }
    setHasChangesUpdate(true); 
    console.log(siteFormValues)
  };



  const tbRefInit = useRef(null);

  //road input form values
  const [roadInputformValues, setRoadInputFormValues] = useState({
    road_id:'',//접근로 id
    road_name:'', //접근로 명칭
    incoming_compass:'북',//진입 방향
    outgoing_compass:'남서',//진출 방향
    incoming_lane_cnt:'6',//진입 방향 차선수
    outgoing_lane_cnt:'6',//진출 방향 차선수
    incoming_direction_sub1:'',
    incoming_direction_sub2:'',
    incoming_direction_sub3:'',
    incoming_direction_sub4:'',
    incoming_direction_sub5:'',
    incoming_direction_sub6:'',
    crosswalk:'존재',//횡단보도 유무
    crosswalk_length:'',//횡단보도 길이
    corsswalk_width:'',//횡단보도 폭
    traffic_light:'북',//보행자 신호등 유무
    mapping_detector:'',//매핑 검지기
    related_site_id1:'',//사이트 id (연관된)
    related_site_id2:''//사이트 id (연관된)
  })

  const [maxRoadInputForms,setMaxRoadInputForms]=useState(0)
  const [curRoadInputForms,setCurRoadInputForms]=useState(0)

  //
  const handleRoadInputChange = (e) =>{
    const { name, value } = e.target; 
    console.log(name)
    console.log(value)

    setRoadInputFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    if (isNewClicked) {//new버튼 클릭했을때만
      setHasChangesCreate(true); 
    } else {
      setHasChangesUpdate(true); 
    }

    console.log(roadInputformValues)
  }

  // 테이블 row선택시
  const handleRowSelected = useCallback((row) => {
    const rowData = row.getData();

    if(hasChangesCreateRef.current || hasChangesUpdateRef.current){{
      const message = new NoticeMessage(
              t('msg > flush confirm'),
              {
                mode: "confirm",
              }
            );
            message.confirmClicked().then(() => {
              //const rowData = row.getData();
              setDisabledForm(false)
              setHasChangesUpdate(false)
              enableUpdateButtons()
              setIsNewClicked(false);
            });
    } 
  }else {
    setDisabledForm(false)
    setHasChangesUpdate(false)
    enableUpdateButtons()
    setIsNewClicked(false);
    //setGroupList([])
  }
  
  const siteId = rowData.site_id
  //camel case
  console.log('siteId:'+siteId);
  setSiteId(siteId)

  // 바로 폼에 값을 설정하는 방식
  setSiteFormValues({
    site_id: rowData.site_id,
    name: rowData.name,
    address: rowData.address,
    lat: rowData.lat,
    lng: rowData.lng,
    type:'102001',
    type_value: rowData.type_value || "교차로",
    number_road: rowData.number_road || "",
    mapping_box: rowData.mapping_box || "",
    description:"description"
  });
    
  }, []);
  
  // select site type - Intersection or Crosswalk
  const getSiteTypeOptions = () => {
    if (siteFormValues.type_value === 'Intersection') {
      console.log('Intersection');

      return [
        { label: '교차로', value: '교차로' },
        { label: '횡단보도', value: '횡단보도' }
      ];
    } else if (siteFormValues.type_value === 'Crosswalk') {
      console.log('Crosswalk');

      return [
        { label: '횡단보도', value: '횡단보도' },
        { label: '교차로', value: '교차로' }
      ];
    }
    return [];
  };
    
  // Use useEffect to trigger the update when type_value changes
  useEffect(() => {
    if (siteFormValues.type_value === 'Intersection') {
      setSiteFormValues((prevValues) => ({
        ...prevValues,
        type: '102001',
      }));
    } else if (siteFormValues.type_value === 'Crosswalk') {
      setSiteFormValues((prevValues) => ({
        ...prevValues,
        type: '102002',
      }));
    }
  }, [siteFormValues.type_value]); // Dependency array ensures this runs when `type_value` changes

  //CRUD Button Group
  //Button State
  const [buttonState, setButtonState] = useState({
    confirm: true,
    cancel: true,
    delete: true,
    create: false,
  });
  const tbRef = useRef(null);
  const searchRef = useRef(null);
  const idRef = useRef(null);
  const nameRef = useRef(null);
  const [disabledForm, setDisabledForm] = useState(true);
  const [disabledId, setDisabledId] = useState(true);
  const [hasChangesUpdate, setHasChangesUpdate] = useState(false);
  const [hasChangesCreate, setHasChangesCreate] = useState(false);
  const [isRequired, setIsRequired] = useState(false);
  const hasChangesUpdateRef = useRef(hasChangesUpdate);
  const hasChangesCreateRef = useRef(hasChangesCreate);
  const [newId, setNewId] = useState('');
  const [isNewClicked, setIsNewClicked] = useState(false);

  //empty form data
  const emptyDetail = () => {
    setSiteFormValues((prevValues) => ({
      ...prevValues,
      site_id:'',
      name:'',
      address:'',
      lat:'',
      lng:'',
      type:'102001',
      type_value:'Intersection',
      number_road:'',
      mapping_box:'',
      description:'description'
    }));
  };

  //CRUD Button Group Function
  const disableAllButtons = () => {
    setButtonState({
      confirm: true,
      cancel: true,
      delete: true,
      create: true,
    });
  };

  const enableInitialButtons = () => {
    disableAllButtons();
    setIsNewClicked(false); 
    setButtonState((prevState) => ({
      ...prevState,
      create: false,
    }));
  };

  const enableUpdateButtons = () => {
    disableAllButtons();
    setButtonState((prevState) => ({
      ...prevState,
      cancel: false,//disable-false는 활성화
      delete: false,//disable-false는 활성화
      create: false,//disable-false는 활성화
    }));
  };

  const handleNewButtonClick = () => {
      //alert('new!')
      setIsNewClicked(true);
      setDisabledForm(false);
      emptyDetail()
      setSiteId(null)
      setRoadInputList([])
      //siteId를 null로 하면 road 데이터 초기화
  };
  const handleRegistButtonClick = () => {
      //alert('regist!')
      //입력폼 검사
      const updatedSiteFormValues = {
        ...siteFormValues
      }
      createSite(updatedSiteFormValues)
  }

  const handleConfirmButtonClick = () => {
      //alert('confirm!')
      const updatedSiteFormValues = {
        ...siteFormValues
      }
      //test sample
      const testSample = {
        "name":'aaa',
        "type":'bbb',
        "address":'ccc',
        "lat":12.3,
        "lng":12.4,
        "description":"ddd"
      }
      alert('변경될값 확인')
      const siteId = updatedSiteFormValues.site_id
      console.log('변경될값 확인')
      console.log(updatedSiteFormValues)
      console.log(siteId)
      console.log(testSample)
      
      setDisabledForm(false)
      setHasChangesUpdate(false)
      enableUpdateButtons()
      setIsNewClicked(false);

      updateSite(updatedSiteFormValues)
      
  }
  
  const handleCancelButtonClick = () => {
      //alert('cancel!')
      
      if (hasChangesUpdate){
        const message = new NoticeMessage(
          t('msg > flush confirm'),
          {
            mode: "confirm",
          }
        );
        message.confirmClicked().then(() => {
          //alert('취소!')
          setDisabledForm(false);
          emptyDetail()
          setSiteId(null)
          //siteId를 null로 하면 road 데이터 초기화
        });
      }
      else{
        setDisabledForm(false);
        emptyDetail()
        setSiteId(null)
        //siteId를 null로 하면 road 데이터 초기화
      }
  };

  const handleDeleteButtonClick = () => {
      alert('delete!')
      const message = new NoticeMessage(
      t('msg > delete confirm'),
      {
        mode: "confirm",
      }
    );
    message.confirmClicked().then(() => {
      alert('삭제 진행!')
      const siteId=siteFormValues?.site_id
      deleteSite(siteId)
    });
  };

  const reloadCallback = () => {
    enableInitialButtons();
    tbRef.current.deselectRow();
    setIsRequired(false);
    emptyDetail();
    setDisabledForm(true);
    setDisabledId(true);
    setHasChangesUpdate(false);
    setSelectedUser({ id: null });
  };

  const {mapped_box} = detailSiteData?.data || ""

  return (
    <>
      <section className="wrap">
        <div className="header-title">
          <h3>사이트 관리</h3>
          <h3>&gt;</h3>
          <h3>사이트</h3>
        </div>

        <ContainerCard>
          <Filtering
            // labelSelect="매핑 사이트 타입"
            placeholder="명칭 / 시리얼 넘버"
            disableFiltering={true}
          >
          </Filtering>
        </ContainerCard>

        <ContainerCard>
          <ReactTabulator
            data={siteListData?.data || []}
            columns={boxTabulator}
            layout={"fitColumns"}
            className="tabulator-custom w-full "
            //   pagination="local"
            options={optionsTabulator}
            onRef={(r) => {
              tbRefInit.current = r.current;
            }}
            events={{
              rowSelected: handleRowSelected,
              tableBuilt: () => {
                console.log('tableBuilt')
              },
            }}
          />
        </ContainerCard>

        <ContainerCard className=" flex flex-col">
          <div className="gap-2.5 flex flex-col">
            <span className="title2bold ">사이트</span>
            {/* <hr className="border-t border-gray-300" /> */}
          </div>

          <div className="box-management-col flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-[50px]">
              <DetailForm 
              className="items-center!" 
              label="사이트 ID" 
              onChange={handleSiteInputChange}
              name="site_id"
              value={siteFormValues.site_id || ''}
              disabled={true}
              />

              <DetailForm
                className="items-center!"
                label="명칭"
                required={true}
                placeholder="삼성역 사거리 교차로"
                onChange={handleSiteInputChange}
                name="name"
                value={siteFormValues.name || ''}
                disabled={disabledForm}
              />

              <DetailForm
                className="items-center!"
                label="주소"
                required={true}
                placeholder="서울시 강남구 삼성동"
                onChange={handleSiteInputChange}
                name="address"
                value={siteFormValues.address || ''}
                disabled={disabledForm}
              />
            </div>

            <div className="grid grid-cols-3 gap-[50px]">
              <div className="flex w-full flex-row gap-x-4">
                <DetailForm
                  className="items-center!"
                  label="위도 / 경도"
                  required={true}
                  showInput={false}
                >
                  <div className="flex w-full flex-row gap-x-2">
                    <GeneralInput 
                        customInput="w-full" 
                        placeholder="5.55555" 
                        onChange={handleSiteInputChange} 
                        name="lat"
                        value={siteFormValues.lat || ''}
                        disabled={disabledForm}
                      />
                      <GeneralInput 
                        customInput="w-full" 
                        placeholder="5.55555" 
                        onChange={handleSiteInputChange} 
                        name="lng"
                        value={siteFormValues.lng || ''}
                        disabled={disabledForm}
                      />
                  </div>
                </DetailForm>
              </div>

              <DetailForm
                inputType="select"
                className="items-center!"
                label="타입"
                required={true}
                optionSelect={getSiteTypeOptions()} // Dynamic options based on site_type

                onChange={handleSiteInputChange} name="site_type"
                disabled={disabledForm}
              />

              <DetailForm 
                className="items-center!" 
                label="접근로 수" 
                onChange={handleSiteInputChange} 
                name="number_road"
                value={siteFormValues.number_road || ''}
                disabled={isNewClicked? false:true}
                //목록은 비활성화, 입력시에는 활성화
              />
            </div>

            <div className="grid grid-cols-3 gap-[50px]">
              <DetailForm
                className="items-center!"
                label="매핑 함체"
                required={true}
                placeholder="BX01001(ID0001)"
                onChange={handleSiteInputChange} 
                name="mapping_box"
                disabled={true}
                value={mapped_box}
              />
            </div>

            <hr className="border-t border-gray-300" />

            <div className="gap-2.5 flex flex-row items-center">
              <span className="title2bold ">접근로</span>
              <span
                className="body1bold px-[20px] py-[3px] bg-[#3D6B85] text-[#FEFEFE] "
                onClick={addDynamicGroup}
              >
                Add +
              </span>
              {/* <hr className="border-t border-gray-300" /> */}
            </div>
            
            {
            isNewClicked? 
            // 입력시 출력되는 접근로 목록
            roadInputList?.map((data, index) => (
              <div key={index}>
                <DynamicForm index={index} 
                onDelete={()=>deleteDynamicGroup('input_mode',data.road_id)} 
                handleRoadInputChange={handleRoadInputChange}
                road_id={data.road_id}
                name={data.name}
                crosswalk_length={data.crosswalk_length}
                crosswalk_width={data.crosswalk_width}
                incoming_direction={data.incoming_direction}
                site_id={data.site_id}
                crosswalk={data.crosswalk}//횡단보도 유무
                incoming_compass={data.incoming_compass}//진입방향
                outgoing_compass={data.outgoing_compass}//진출방향
                incoming_lane_cnt={data.incoming_lane_cnt}//진입 차선수
                outgoing_lane_cnt={data.outgoing_lane_cnt}//진출 차선수
                mapped_vms={data.mapped_vms}
                mapped_speaker={data.mapped_speaker}
                />
              </div>
            ))
            : //행 선택시 출력되는 접근로 목록
            roadListData?.map((data, index) => (
              <div key={index}>
                <DynamicForm index={index} 
                onDelete={()=>deleteDynamicGroup('list_mode',data.road_id)} 
                handleRoadInputChange={handleRoadInputChange}
                road_id={data.road_id}
                name={data.name}
                crosswalk_length={data.crosswalk_length}
                crosswalk_width={data.crosswalk_width}
                incoming_direction={data.incoming_direction}
                site_id={data.site_id}
                crosswalk={data.crosswalk}//횡단보도 유무
                incoming_compass={data.incoming_compass}//진입방향
                outgoing_compass={data.outgoing_compass}//진출방향
                incoming_lane_cnt={data.incoming_lane_cnt}//진입 차선수
                outgoing_lane_cnt={data.outgoing_lane_cnt}//진출 차선수
                mapped_vms={data.mapped_vms}
                mapped_speaker={data.mapped_speaker}
                />
              </div>
            ))
            
            }

            <hr className="border-t border-gray-300" />
            <div className="flex items-center justify-between gap-4 w-full">
              <div className="flex-1">
                <LogList logs={logData} />
              </div>
              <div className="flex-none">
                <ButtonGroup
                  onClickDelete={handleDeleteButtonClick}
                  onClickNew={handleNewButtonClick}
                  onClickCancel={handleCancelButtonClick}
                  onClickRegist={handleRegistButtonClick}
                  onClickConfirm ={handleConfirmButtonClick}
                  isNewClicked={isNewClicked}
                  cancelButtonState={buttonState.cancel}
                  confirmButtonState={hasChangesUpdate ? false : buttonState.confirm}
                  deleteButtonState={buttonState.delete}
                  newButtonState={hasChangesCreate ? false :buttonState.create}
                />
              </div>
            </div>
          </div>
        </ContainerCard>
      </section>
    </>
  );
};

export default SiteManagement;
