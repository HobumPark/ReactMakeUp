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
    widthGrow: ".6",
    headerSort: true,
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
    headerSort: true,
    resizable: false,
  },
];

const SiteManagement = () => {
  const { t, i18n } = useTranslation();
  // queryClient 가져오기
  const queryClient = useQueryClient();

  const createCallback = () => {

  };

  const updateCallback = () => {
    enableUpdateButtons();
    setIsRequired(false);
    setHasChangesUpdate(false);
    //tbRef.current.deselectRow();
  };

  const [queryParams, setQueryParams] = useState(""); // queryParams 상태
  const [siteId, setSiteId] = useState(null); // siteId 상태
  //const [selectedSiteId, setSelectedSiteId]= useState(null)
  const [curRowId, setCurRowId] = useState(null); //현재 선택된 row번호

  const [closeNoticeState,setCloseNoticeState]=useState(null);
  //삭제 노티스 상태관리

  // site 데이터 가져오기
  const { siteListData, detailSiteData, updateSite, updateSiteRoad, deleteSite, createSite, createSiteRoad, deleteSiteRoad,  } = useSiteMgt({
    queryParams: queryParams || "", siteId, 
    onUpdateSuccess: (responseData) =>{
      console.log('onUpdateSuccess')
      //alert('onUpdateSuccess')
      updateCallback()
      //InitSiteRoadInputForm()
    },
    onDeleteSuccess: () => {
      console.log('onDeleteSuccess')
      //alert('onDeleteSuccess')
    },
    onCreateSuccess: (responseData) => {
      console.log('onCreateSuccess')
      //alert('onCreateSuccess')
    },
  });
  console.log('useSiteMgt');
  console.log('siteListData');
  console.log(siteListData);
  console.log('detailSiteData');
  console.log(detailSiteData);

  const { roadListData, updateRoad, deleteRoad, createRoad} = useRoadMgt({
    queryParams: siteId ? `site_id=${siteId}` : null, // siteId가 있을 때만 API 호출
    onUpdateSuccess: (responseData) =>{
      console.log('onUpdateSuccess')
      //alert('onUpdateSuccess')
    },
    onDeleteSuccess: () => {
      console.log('onDeleteSuccess')
      //alert('onDeleteSuccess')
    },
    onCreateSuccess: (responseData) => {
      console.log('onCreateSuccess')
      //alert('onCreateSuccess')
    },
  });

  console.log('useRoadMgt');
  console.log(roadListData);
  //console.log(isLoadingRoad);
  //console.log(error);

  const [selectedOption, setSelectedOption] = useState("");

  const handleChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const options = [
    { value: "전체", label: "전체" },
    { value: "교차로", label: "교차로" },
    { value: "횡단보도", label: "횡단보도" },
  ];



  const languageTabulator = () => {
    let datalanguage = {
      pagination: {
        first: t('cmn > first page'), //text for the first page button
        first_title:t('cmn > first page'), //tooltip text for the first page button
        last:t('cmn > last page'),
        last_title: t('cmn > last page'),
        prev: t('cmn > page before'),
        prev_title: t('cmn > page before'),
        next: t('cmn > next page'),
        next_title: t('cmn > next page'),
      },
    }
    return datalanguage
  }

  const optionsTabulator = {
    selectableRows: 1,
    pagination: true,
    paginationSize: 10,
    rowHeight: 41,
    index: "id",
    locale: "ko",
    langs: {
      ko: languageTabulator(),
    },
    movableRows: false,
    resizableRows: false,
    footerElement: `<div style="padding: 0 20px 0 0; text-align: right;">총 ${siteListData?.data.length} 건</div>`,
    selectableRowsCheck:(row)=>{
      return !row.getElement().classList.contains("tabulator-selected")
    },
    //index: "site_id", // index 필드를 지정하여 행을 고유하게 식별  
  };

  //입력용 road 목록
  const [roadInputList, setRoadInputList] = useState([]);

  useEffect(() => {
    // roadListData가 존재하고, roadInputList가 변경되지 않았을 때만 업데이트
      console.log('roadListData');
      console.log(roadListData); // API에서 가져온 접근로 목록 상태값에 저장해놓음 (추후 수정용)
      const data = Array.isArray(roadListData) ? roadListData : roadListData?.data;
      //alert('useEffect roadInputListChange 로드입력 값변경')

      if(data){
        const updatedData = data.map(item => ({
          ...item,        // 기존 아이템의 모든 속성을 복사
          is_new: false    // `isNew` 키 추가 (기본값은 false, 필요에 따라 수정 가능)
        }));//isNew는 기존데이터임을 표시
        //새로 박스 생성시에는 isNew - true해서 새로운 데이터임을 표시

        setRoadInputList(updatedData);
      }else{
        setRoadInputList([])
      }
    
  }, [roadListData]); // roadListData가 변경될 때만 실행


  //add dynamic input form of road
  const addDynamicGroup = () => {
    //이것도, 수정시에 박스 생성인지... (그럼 사이트 아이디를 정보에 포함시켜야하고)
    //최초 생성시에 박스 생성인지... (그럼 사이트 정보는 아직없는것)
    //isNewClicked로 신규 추가인지 아닌지 구분할수있겠다.

    console.log('addDynamicGroup')
    console.log(roadInputList)
    console.log(siteInputFormValues.number_road)

    const number_road=parseInt(siteInputFormValues.number_road)+1
    setSiteInputFormValues({
      ...siteInputFormValues,
      number_road:number_road,
    })
    
    var siteId = ''
    if(isNewClicked==true){
      //신규 생성이면
      siteId=''
    }else{
      //아닐경우
      siteId = siteInputFormValues.site_id
    }

    setRoadInputList([
      ...roadInputList, 
      {
        site_id:siteId,//사이트 id
        road_id:'',//접근로 id
        name:'', //접근로 명칭 road_name
        incoming_compass:'103001',//진입 방향
        outgoing_compass:'103002',//진출 방향
        incoming_lane_cnt:2,//진입 방향 차선수
        outgoing_lane_cnt:2,//진출 방향 차선수
        incoming_direction_sub1:'', //진입방향1
        incoming_direction_sub2:'', //진입방향2
        incoming_direction_sub3:'', //진입방향3
        incoming_direction_sub4:'', //진입방향4
        incoming_direction_sub5:'', //진입방향5
        incoming_direction_sub6:'', //진입방향6
        incoming_direction:'',//방향 모두 합친 값
        crosswalk:'',//횡단보도 유무 - 105002
        crosswalk_length:'',//횡단보도 길이
        crosswalk_width:'',//횡단보도 폭
        traffic_light:'',//보행자 신호등 유무 - 106002
        mapped_detector:'',//매핑 검지기
        mapped_vms:'', //매핑 전광판
        mapped_speaker:'',//매핑 스피커
        is_new:true//동적박스 생성시에는 새로 추가되는 데이터다
      }
    ]);

  };

  // road list 삭제
  const deleteDynamicGroup = (mode, road_id, index) => {
    //alert('roadList delete')
    //roadList delete button
    console.log('입력 모드:'+mode)
    console.log('접근로 아이디:'+road_id)
    console.log('삭제할 인덱스 번호:'+index)
    if(mode == 'input_mode'){
      //alert(road_id+" 번 접근로 단순 입력 목록 삭제")
      //alert('삭제할 인덱스 번호:'+index)

      // 특정 인덱스를 제외한 새로운 배열 만들기
      // 특정 인덱스를 제외한 새로운 배열 만들기
      const updatedRoadInputList = roadInputList.filter((_, i) => i !== index);

      // 상태 업데이트
      setRoadInputList(updatedRoadInputList);
      console.log(updatedRoadInputList)
    
    }else if(mode == 'list_mode'){
      //상세보기 목록 모드에서도
      //기존데이터 + 새로 입력한 데이터 섞여있으므로 is_new로 검사해서
      //삭제 API날릴 데이터인지, 단순히 박스만 삭제할지

      const roadToDelete = roadInputList[index];

      if (roadToDelete.is_new==false) {
        //기존에 존재하던 데이터면 삭제 API
        deleteRoad(road_id)
      }
      const updatedRoadInputList = roadInputList.filter((_, i) => i !== index);
      // 상태 업데이트
      setRoadInputList(updatedRoadInputList);
   
    }
  };

  //site input form values, row data to display
  const [siteInputFormValues, setSiteInputFormValues] = useState({
    site_id:'',
    name:'',
    address:'',
    lat:'',
    lng:'',
    type:'',
    number_road:0,
    mapped_box:'',
    description:'description'
  })

  // select on change - intersection and crosswalk
  const handleSiteInputChange = (e) => {
    const { name, value } = e.target;
    console.log('handleSiteInputChange')
    console.log(name)
    console.log(value)

    setSiteInputFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));


    if (isNewClicked) {//new버튼 클릭했을때만
      console.log('생성버튼을 누른상태에서 입력변화')
      setHasChangesCreate(false);// 
      setHasChangesUpdate(false);//생성시에는 변경 되지않았다고 표시 (저장 비활성화)
      disableConfirmButtons()//생성시에는 register만 하면되고 저장(수정)은 필요없다.
      enableCancelButtons()
  
    } else {
      setHasChangesUpdate(true); 
      
    }
    //setHasChangesUpdate(true); 
    console.log('siteInputFormValues')
    console.log(siteInputFormValues)
  };

  //const tbRefInit = useRef(null);

  //진입, 진출방향 상태값
  const handleRoadInputChange = (e, mode, index) =>{
    console.log('접근로 정보 입력 change')
    console.log(e.target.name)
    console.log(e.target.value)
    console.log(mode)
    console.log(index)
    
    const inComingCompass = roadInputList[index]?.incoming_compass
    const outGoingCompass = e.target.value
    
    console.log('inComingCompass')
    console.log(inComingCompass)
    console.log('outGoingCompass')
    console.log(outGoingCompass)
    console.log('roadInputList')
    console.log(roadInputList)
    console.log(roadInputList[index].crosswalk)
    if(e.target.name == 'outgoing_compass' ){
      //alert('진출 방향 선택중')
      //진출방향 선택하면 진입방향 검사하여 둘의 일치여부 확인
      if(outGoingCompass===inComingCompass){
        alert('진출방향과 진입방향은 일치하면 안됩니다. 다시선택하세요!')
        return
      }

    }

    // 복사본을 만들어서 해당 index에 있는 원소를 업데이트
    const updatedRoadInputList = [...roadInputList]; // 기존 리스트 복사
    console.log('initial updatedRoadInputList')
    console.log(updatedRoadInputList)
    console.log('handleRoadInputChange')
    console.log(e.target.name+' 수정')
    console.log(e.target.value+' 수정')
    
    updatedRoadInputList[index] = {
        ...updatedRoadInputList[index], // 해당 index의 기존 데이터 복사
        [e.target.name]: e.target.value, // 변경된 값을 넣어줌
    };

    console.log('updatedRoadInputList111')
    console.log(updatedRoadInputList)
    //setRoadInputList(updatedRoadInputList);

  // 'incoming_direction_sub1' 부터 'incoming_direction_sub6'까지 값을 검사하여 '|'로 합침
  const directionFields = [
    'incoming_direction_sub1',
    'incoming_direction_sub2',
    'incoming_direction_sub3',
    'incoming_direction_sub4',
    'incoming_direction_sub5',
    'incoming_direction_sub6'
  ];

    // 접근방향 1~6 검사하여 - 값이 채워진 것들만 필터링하여 합침
    // 좌|직 , 좌|직|직  , 좌,직|직,좌|직 , ....
    const incomingDirectionValues = directionFields
      .map(field => updatedRoadInputList[index][field])
      .filter(value => value !== '' && value !== null && value !== undefined); // 빈 값 제외

    // 'incoming_direction'에 '|'로 합친 값 넣기
    if (incomingDirectionValues.length > 0) {
      updatedRoadInputList[index].incoming_direction = incomingDirectionValues.join('|');
    } else {
      //updatedRoadInputList[index].incoming_direction = ''; // 값이 없으면 빈 문자열
    }

    console.log('updatedRoadInputList222');
    console.log(updatedRoadInputList);

    // 변경된 리스트를 상태에 반영
    setRoadInputList(updatedRoadInputList);

    if (isNewClicked) {//new버튼 클릭했을때만
      setHasChangesCreate(true); 
      disableConfirmButtons()//생성시에는 register만 하면되고 저장(수정)은 필요없다.
    } else {
      setHasChangesUpdate(true); 
    }

  }

  // 테이블 row선택시
  const handleRowSelected = useCallback((row) => {
    setRoadInputList([])
    const rowData = row.getData();  // 선택된 행의 데이터
    const rowNum = row.getPosition(); // DOM에서 직접 행 번호를 가져오기

    console.log('rowData:', rowData);
    console.log('rowNum:', rowNum);
    
    //선택된 행 번호를 저장해놓음 (선택,해제 할때 쓰기 위하여)
    setCurRowId(rowNum)

    //수정작업을 대비하여
    //site - 현재 값들을 siteInpuForm에 넣어놓기
    //road - 현재 값들을 roadInputList에 넣어놓기

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
  setSiteInputFormValues({
    site_id: rowData.site_id,
    name: rowData.name,
    address: rowData.address,
    lat: rowData.lat,
    lng: rowData.lng,
    type:'',
    number_road: rowData.number_road || "",
    mapped_box: rowData.mapped_box || "",
    description:"description"
  });
    
  console.log('roadInputList check')
  console.log(roadInputList)
  console.log(roadListData)
  }, []);
  
  // select site type - Intersection or Crosswalk
  const getSiteTypeOptions = () => {
    console.log('getSiteTypeOptions')
    console.log(siteInputFormValues.type)
    if (siteInputFormValues.type === '102001') {
      console.log('Intersection');

      return [
        { label: '교차로', value: '102001' },
        { label: '횡단보도', value: '102002' }
      ];
    } else if (siteInputFormValues.type === '102002') {
      console.log('Crosswalk');

      return [
        { label: '횡단보도', value: '102002' },
        { label: '교차로', value: '102001' }
      ];
    }
    return [];
  };
    

  //CRUD Button Group - Button State
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
  const [isNewClicked, setIsNewClicked] = useState(false);

  //site입력폼 비우기
  const emptyDetail = () => {
    setSiteInputFormValues((prevValues) => ({
      ...prevValues,
      site_id:'',
      name:'',
      address:'',
      lat:'',
      lng:'',
      type:'',
      number_road:0,
      mapped_box:'',
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

  //
  const enableInitialButtons = () => {
    disableAllButtons();
    setIsNewClicked(false); 
    setButtonState((prevState) => ({
      ...prevState,
      create: false,
    }));
  };

  //수정관련 버튼 활성화
  const enableUpdateButtons = () => {
    disableAllButtons();
    setButtonState((prevState) => ({
      ...prevState,
      cancel: false,//disable-false는 활성화
      delete: false,//disable-false는 활성화
      create: false,//disable-false는 활성화
    }));
  };

  //삭제버튼 비활성화
  const disableDeleteButtons = () => {
    setButtonState((prevState) => ({
      ...prevState,
      delete: true,//비활성화
    }));
  };

  //취소버튼 비활성화
  const disableCancelButtons = () => {
    setButtonState((prevState) => ({
      ...prevState,
      cancel: true,//비활성화
    }));
  };

  //취소버튼 활성화
  const enableCancelButtons = () => {
    setButtonState((prevState) => ({
      ...prevState,
      cancel: false,//활성화
    }));
  };

  //확인 버튼 비활성화
  const disableConfirmButtons = () => {
    setButtonState((prevState) => ({
      ...prevState,
      confirm: true,//비활성화
    }));
  };

  const handleSearch = useCallback(
      (inputVal = null) => { 
        //alert('검색!')
        const resultInput = inputVal ? `input=${inputVal}` : "";
        //alert(resultInput)//검색어
        const result = resultInput;
        setQueryParams(result); 
        //검색후 하단 박스 초기화
        enableInitialButtons()
        emptyDetail()
        disabledForm()
      }, []
  );

  const handleNewButtonClick = () => {//생성 버튼 누르면
      //alert('new!')
      setIsNewClicked(true); //생성버튼 비활성화
      setDisabledForm(false); //
      emptyDetail() // 사이트 입력폼 모두 비우기
      setSiteId(null) //사이트 아이디 해제
      
      disableConfirmButtons() //확인버튼 비활성화
      disableCancelButtons()//취소버튼 비활성화
      disableDeleteButtons()//삭제버튼 비활성화
      //siteId를 null로 하면 road 데이터 초기화
      //alert('handleNewButtonClick 로드입력 값변경')
      tbRef.current.deselectRow();
      setRoadInputList([])//접근로 입력목록 초기화 (모두 비우기)
  };

  const InitSiteRoadInputForm=()=>{
    setRoadInputList([])
    
    setSiteInputFormValues({
      site_id:'',
      name:'',
      address:'',
      lat:'',
      lng:'',
      type:'',
      number_road:'',
      mapped_box:'',
      description:'description'
    })
  }

  //등록버튼 클릭시
  const handleRegistButtonClick = async () => {
    //alert('regist!');
    // 입력폼 검사
    const isSiteRoadInputFormValid = siteRoadInputFormCheck();
    if (!isSiteRoadInputFormValid) {
      return; // 입력검사 통과 못하면 끝냄
    }
  
    const createSiteFormValues = { ...siteInputFormValues };
    
    //const siteRoadInfo={siteInfo:createSiteFormValues,roadInputList:roadInputList}
    //createSiteRoad(siteRoadInfo)
    //site추가한다음 아이디를 받아서 해야해서... 한번에 처리하는게 불가능할듯
    //site먼저 처리하고 road를 처리할수밖에
    //createSite -> get site id -> create road with site id
    try {
      // createSite 호출 후, 결과를 처리하는 방법
      createSite(createSiteFormValues, {
        onSuccess: (createSiteResult) => {
          console.log('createSite onSuccess:', createSiteResult);
  
          // site추가 후 반환된 site_id를 사용해야함
          const site_id = createSiteResult?.data?.site_id;  // createSiteResult에서 site_id를 가져옴
          console.log('road추가시 사용될 site_id:', site_id);
  
          if (!site_id) {
            throw new Error('사이트 ID가 없습니다.');
          }
  
          // road 정보는 여러 개이므로 요청을 반복해서 전송해야 함
          console.log('road추가 API전송전 확인');
          console.log(roadInputList);
  
          // 각 roadItem에 대해 createRoad 요청을 비동기적으로 전송
          for (const roadItem of roadInputList) {
            console.log('roadItem'); // 각 항목을 확인
            console.log(roadItem)
            createRoad({ ...roadItem, site_id }); // 각 요청을 비동기적으로 처리
          }

          //alert('등록이 완료되었습니다!');
          //등록후 입력폼 초기화 - init site, road form
          InitSiteRoadInputForm()
          
        },
        onError: (error) => {
          console.error('createSite onError:', error);
          //alert('사이트 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
      });
    } catch (error) {
      console.error('API 요청 중 오류 발생:', error);
      //alert('오류가 발생했습니다. 다시 시도해주세요.');
    }
  };
  
  const siteRoadInputFormCheck = () =>{//사이트 정보, 접근로 정보 입력필드 검사 함수
    // 제외할 필드들
    const excludedFields = ['site_id', 'type', 'number_road', 'mapped_box'];//입력검사시에 제외할 필드 - site check exclude field
    //사이트 아이디는 자동으로 생성됨, 함체정보는 입력하지 않음

     // 사이트정보 입력 폼검사 - 제외할 필드를 제외한 나머지 필드들만 검사
      const emptyFields = Object.keys(siteInputFormValues)
      .filter(key => !excludedFields.includes(key))  // 제외할 필드를 필터링
      .filter(key => siteInputFormValues[key] === null || siteInputFormValues[key] === '');  // 비어있는 필드만 필터링

    // 비어있는 필드 출력
    if (emptyFields.length > 0) {
      console.log('비어있는 필드들:', emptyFields);
      // 비어있는 필드들의 이름을 알림으로 띄우거나 처리
      new NoticeMessage(t('다음 필드들이 비어있습니다: ' + emptyFields.join(', ')));
    } else {
      console.log('모든 필드가 채워졌습니다.');
    }

    // 사이트 정보 입력 폼이 모두 채워졌는지 확인
    if (emptyFields.length > 0) {
      new NoticeMessage(t('모든 필드에 값을 채우세요'));
      return false;  // 비어있는 필드가 있으면 false 리턴
    }

    //접근로 입력 갯수만큼 생성된 동적박스에 입력값이 모두 채워졌는지도 검사해야한다.
    const isRoadFieldsFilled = roadInputList?.every((item, index) => {

      return Object.entries(item).every(([key, value]) => {
         // exclude filed dont check - 제외할 필드는 체크하지 않음
         // like input - disabled={true}
        const excludedFields = ['site_id','road_id', 'mapped_detector', 'mapped_vms', 'mapped_speaker',
          'incoming_direction_sub3','incoming_direction_sub4','incoming_direction_sub5','incoming_direction_sub6'];
        //접근방향 1,2,3,4,5,6 은 모두 채우지 않아도 상관없다. 일단 1,2만 필수 3,4,5,6은 제외시켜둠
        //접근방향 모두 합친값(incoming_direction)은 입력할때마다 새로 갱신
        //road check exclude field

        // exclude filed dont check - 제외할 필드는 체크하지 않음
        if (excludedFields.includes(key)) {
          return true;
        }
        
        // 빈 값, null, undefined 확인
        if (value === '' || value === null || value === undefined) {
          console.log(`Row ${index + 1}: 필드 "${key}" 가 비어 있습니다.`); // 어떤 필드가 비어있는지 출력
          return false;
        }
        
        return true;
      });
    });
    
    console.log("모든 값이 채워졌는지:", isRoadFieldsFilled);
    
    if (isRoadFieldsFilled) {
      console.log("모든 입력 값이 채워졌습니다.");
    } else {
      new NoticeMessage(t('접근로 관련 모든 정보를 입력하세요.'));
      console.log("입력 값이 부족한 항목이 있습니다.");
      return false
    }
    //input form fully filled completed - 입력이 모두 완료되었으면
    //new NoticeMessage(t('모든 필드가 올바르게 입력되었습니다.'));
    console.log("사이트, 접근로 관련 모든 필드가 올바르게 입력되었습니다.");

    return true;
  }


  const handleConfirmButtonClick = () => {
      //alert('confirm!')
      const updatedSiteInputFormValues = {
        ...siteInputFormValues
      }
      setSiteInputFormValues({...siteInputFormValues})
      
      //alert('변경될값 확인')
      const siteId = updatedSiteInputFormValues.site_id
      console.log('변경될 값 확인')
      console.log(updatedSiteInputFormValues)
      console.log(siteId)
      
      setDisabledForm(false)
      setHasChangesUpdate(false)
      enableUpdateButtons()
      setIsNewClicked(false);
      
      const siteRoadInfo={siteInfo:updatedSiteInputFormValues,roadInputList:roadInputList}
      console.log('siteRoadInfo')
      console.log(siteRoadInfo)
      updateSiteRoad(siteRoadInfo)
      //tbRef.current.deselectRow();
      setTimeout(()=>{
        alert('reload')
        window.location.reload()
      },1000)
     
  }
  
  //취소 버튼 클릭시
  const handleCancelButtonClick = () => {
      //alert('cancel!')
      if (hasChangesUpdate){//변경된 상태일때
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
          //siteId -> null : road list empty
        });
      }
      else if(isNewClicked){//new를 누른상태일때
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
           //siteId -> null : road list empty - siteId를 null로 하면 road 데이터 초기화
          setRoadInputList([])
          //siteId를 null로 하면 road 데이터 초기화
        });
      }else{
        setDisabledForm(false);
        emptyDetail()
        setSiteId(null)
        //siteId -> null : road list empty - siteId를 null로 하면 road 데이터 초기화
      }
  };

  const handleDeleteButtonClick = () => {
      //alert('delete!')
      const message = new NoticeMessage(
      t('msg > delete confirm'),
      {
        mode: "confirm",
      }
    );
    message.confirmClicked().then(() => {
      //alert('삭제 진행!')
      const siteId=siteInputFormValues?.site_id
      const roadIdList = roadInputList.map(item => item.road_id);
      console.log(roadIdList);
      const siteRoadInfo = {siteId:siteId,roadIdList:roadIdList}

      deleteSiteRoad(siteRoadInfo)
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
    setSiteId(null)
    //setSelectedUser({ id: null });
  };


  const {mapped_box} = detailSiteData?.data || ""
  //매핑함체는 사이트 상세정보 API에서 가져와야함

  //logData
  useEffect(() => {
      
      if (detailSiteData) {
        console.log('useEffect detailSiteData')
        console.log(detailSiteData)
      }
  }, [detailSiteData]); 
  
    const logData = detailSiteData?.data
    ? [
        { label: t('cmn > registered by'), value: detailSiteData?.data.registered_by || '' },
        { label: t('cmn > registered time'), value: detailSiteData?.data.registered_time || ''},
        { label: t('cmn > updated by'), value: detailSiteData?.data.updated_by || ''},
        { label: t('cmn > updated time'), value: detailSiteData?.data.updated_time || ''},
      ]
    : [];
    
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
            placeholder="사이트ID / 명칭 / 주소"
            disableFiltering={true}
            onSearch={handleSearch}
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
              tbRef.current = r.current;
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
              value={siteInputFormValues.site_id || ''}
              disabled={true}
              />

              <DetailForm
                className="items-center!"
                label="명칭"
                required={true}
                placeholder="삼성역 사거리 교차로"
                onChange={handleSiteInputChange}
                name="name"
                maxLength={100}
                value={siteInputFormValues.name || ''}
                disabled={disabledForm}
              />

              <DetailForm
                className="items-center!"
                label="주소"
                required={true}
                placeholder="서울시 강남구 삼성동"
                onChange={handleSiteInputChange}
                name="address"
                value={siteInputFormValues.address || ''}
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
                        maxLength={10}
                        pattern="^[0-9]*\.?[0-9]*$" // number and . - 숫자와 온점만 허용하는 정규식
                        title="숫자와 온점만 입력 가능합니다." // 사용자가 잘못된 값을 입력할 경우 안내
                        value={siteInputFormValues.lat || ''}
                        disabled={disabledForm}
                      />
                      <GeneralInput 
                        customInput="w-full" 
                        placeholder="5.55555" 
                        onChange={handleSiteInputChange} 
                        name="lng"
                        maxLength={10}
                        pattern="^[0-9]*\.?[0-9]*$" // number and . - 숫자와 온점만 허용하는 정규식
                        title="숫자와 온점만 입력 가능합니다." // 사용자가 잘못된 값을 입력할 경우 안내
                        value={siteInputFormValues.lng || ''}
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
                optionSelect={[
                  { label: '교차로', value: '102001' },
                  { label: '횡단보도', value: '102002' }
                ]} // Dynamic options based on site_type
                onChange={handleSiteInputChange} name="type"
                value={siteInputFormValues.type || '102001'}
                disabled={disabledForm}
              />

              <DetailForm 
                className="items-center!" 
                label="접근로 수" 
                onChange={handleSiteInputChange} 
                name="number_road"
                inputType={"text"}
                pattern={/^[0-9]*$/} 
                maxLength={2}
                value={siteInputFormValues.number_road || ''}
                disabled={true}//road_number input is disabled
              />
            </div>

            <div className="grid grid-cols-3 gap-[50px]">
              <DetailForm
                className="items-center!"
                label="매핑 함체"
                placeholder="BX01001(ID0001)"
                onChange={handleSiteInputChange} 
                name="mapped_box"
                disabled={true}
                value={mapped_box}
              />
            </div>

            <hr className="border-t border-gray-300" />

            <div className="gap-2.5 flex flex-row items-center">
              <span className="title2bold ">접근로</span>
              <span
                className="body1bold px-[20px] py-[3px] bg-[#3D6B85] text-[#FEFEFE] cursor-pointer hover:opacity-80"
                onClick={addDynamicGroup}
              >
                Add +
              </span>
              {/* <hr className="border-t border-gray-300" /> */}
            </div>
            
            {
              roadInputList?.map((data, index) => (
                <div key={index}>
                  <DynamicForm index={index} 
                  onDelete={() => {
                    if (isNewClicked) {
                      deleteDynamicGroup('input_mode', data.road_id, index);
                      //input_mode -> just delete box
                    } else {
                      deleteDynamicGroup('list_mode', data.road_id, index);
                      //liste_mode -> delete API + just delete box 
                    }
                  }}
                  handleRoadInputChange={(e) => handleRoadInputChange(e, 'input_mode', index)}
                  road_id={data.road_id || ''}
                  name={data.name || ''}//접근로 이름
                  crosswalk_length={data.crosswalk_length || ''}
                  crosswalk_width={data.crosswalk_width || ''}
                  traffic_light={data.traffic_light || ''}
                  incoming_direction={data.incoming_direction || ''}
                  site_id={data.site_id || ''}
                  crosswalk={data.crosswalk || ''}//횡단보도 유무
                  incoming_compass={data.incoming_compass || ''}//진입방향
                  outgoing_compass={data.outgoing_compass || ''}//진출방향   
                  incoming_lane_cnt={data.incoming_lane_cnt || ''}//진입 차선수
                  outgoing_lane_cnt={data.outgoing_lane_cnt|| ''}//진출 차선수
                  mapped_detector={data.mapped_detector || ''}
                  mapped_vms={data.mapped_vms || ''}
                  mapped_speaker={data.mapped_speaker || ''}
                  />
                </div>
              ))
            }

            <hr className="border-t border-gray-300" />
            <div className="flex items-center justify-between gap-4 w-full">
              <div className="flex-1">
                {disabledForm ? null : <LogList logs={logData}/>}
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
