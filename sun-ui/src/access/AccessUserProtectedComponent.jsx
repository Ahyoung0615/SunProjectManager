import AttendenceComponent from '../attendence/AttendenceComponent';
import BoardListComponent from '../board/BoardListComponent';
import BoardInsertComponent from '../board/BoardInsertComponent';
import BoardDetailComponent from '../board/BoardDetailComponent';
import BoardUpdateComponent from '../board/BoardUpdateComponent';
import BTripDetailComponent from '../btrip/BTripDetailComponent';
import BTripFormComponent from '../btrip/BTripFormComponent';
import BTripListComponent from '../btrip/BTripListComponent';
import ChatSunComponent from '../chat/ChatSunComponent';
import ChatRoomComponent from '../chat/ChatRoomPage';
import CalendarComponent from '../commodule/CalendarComponent';
import DateTimeComponent from '../commodule/DateTimeComponent';
import NowTimeComponent from '../commodule/NowTimeComponent';
import ModalComponent from '../commodule/ModalComponent';
import OrgChartComponent from '../commodule/OrgChartComponent';
import PaginationComponent from '../commodule/PaginationComponent';
import CoWorkComponent from '../cowork/CoWorkComponent';
import CoWorkMapComponent from '../cowork/CoWorkMapComponent';
import DocumentAppComponent from '../document/DocumentAppComponent';
import DocumentDetailComponent from '../document/DocumentDetailComponent';
import DocumentAppDetailComponent from '../document/DocumentAppDetailComponent';
import DocumentInsertComponent from '../document/DocumentInsertComponent';
import DocumentListComponent from '../document/DocumentListComponent';
import DocumentTempDetailComponent from '../document/DocumentTempDetailComponent';
import DocumentTempListComponent from '../document/DocumentTempListComponent';
import ExpenseApprovalComponent from '../document/ExpenseApprovalComponent';
import VacationDocComponent from '../document/VacationDocComponent';
import MainContentComponent from '../maincontent/MainContentComponent';
import MyPageComponent from '../mypage/MyPageComponent';
import TimeTableListComponent from '../timetable/TimeTableListComponent';
import VacationListComponent from '../vacation/VacationListComponent';
import AccessUserComponent from './AccessUserComponent';
import OcrFileFormComponent from '../OcrFileUpload/OcrFileFormComponent';
import MinutesDetailComponent from '../meeting/MinutesDetailComponent';
import MinutesFormComponent from '../meeting/MinutesFormComponent';
import MinutesListComponent from '../meeting/MinutesListComponent';

// Exporting components with AU prefix
export const AUAttendence = () => (
    <AccessUserComponent>
        <AttendenceComponent />
    </AccessUserComponent>
);

export const AUBoardList = () => (
    <AccessUserComponent>
        <BoardListComponent />
    </AccessUserComponent>
);

export const AUBoardInsert = () => (
    <AccessUserComponent>
        <BoardInsertComponent />
    </AccessUserComponent>
);

export const AUBoardDetail = () => (
    <AccessUserComponent>
        <BoardDetailComponent />
    </AccessUserComponent>
);

export const AUBoardUpdate = () => (
    <AccessUserComponent>
        <BoardUpdateComponent />
    </AccessUserComponent>
);


export const AUBTripDetail = () => (
    <AccessUserComponent>
        <BTripDetailComponent />
    </AccessUserComponent>
);

export const AUBTripForm = () => (
    <AccessUserComponent>
        <BTripFormComponent />
    </AccessUserComponent>
);

export const AUBTripList = () => (
    <AccessUserComponent>
        <BTripListComponent />
    </AccessUserComponent>
);

export const AUChatSun = () => (
    <AccessUserComponent>
        <ChatSunComponent />
    </AccessUserComponent>
);

export const AUChatRoom = () => (
    <AccessUserComponent>
        <ChatRoomComponent />
    </AccessUserComponent>
);

export const AUCalendar = () => (
    <AccessUserComponent>
        <CalendarComponent />
    </AccessUserComponent>
);

export const AUDateTime = () => (
    <AccessUserComponent>
        <DateTimeComponent />
    </AccessUserComponent>
);

export const AUNowTime = () => (
    <AccessUserComponent>
        <NowTimeComponent />
    </AccessUserComponent>
);

export const AUModal = () => (
    <AccessUserComponent>
        <ModalComponent />
    </AccessUserComponent>
);

export const AUOrgChart = () => (
    <AccessUserComponent>
        <OrgChartComponent />
    </AccessUserComponent>
);

export const AUPagination = () => (
    <AccessUserComponent>
        <PaginationComponent />
    </AccessUserComponent>
);

export const AUCoWork = () => (
    <AccessUserComponent>
        <CoWorkComponent />
    </AccessUserComponent>
);

export const AUCoWorkMap = () => (
    <AccessUserComponent>
        <CoWorkMapComponent />
    </AccessUserComponent>
);

export const AUDocumentApp = () => (
    <AccessUserComponent>
        <DocumentAppComponent />
    </AccessUserComponent>
);

export const AUDocumentDetail = () => (
    <AccessUserComponent>
        <DocumentDetailComponent />
    </AccessUserComponent>
);

export const AUDocumentAppDetail = () => (
    <AccessUserComponent>
        <DocumentAppDetailComponent />
    </AccessUserComponent>
);

export const AUDocumentInsert = () => (
    <AccessUserComponent>
        <DocumentInsertComponent />
    </AccessUserComponent>
);

export const AUDocumentList = () => (
    <AccessUserComponent>
        <DocumentListComponent />
    </AccessUserComponent>
);

export const AUDocumentTempDetail = () => (
    <AccessUserComponent>
        <DocumentTempDetailComponent />
    </AccessUserComponent>
);

export const AUDocumentTempList = () => (
    <AccessUserComponent>
        <DocumentTempListComponent />
    </AccessUserComponent>
);

export const OCRFileUploadForm = () => (
    <AccessUserComponent>
        <OcrFileFormComponent/>
    </AccessUserComponent>
)

export const AUExpenseApproval = () => (
    <AccessUserComponent>
        <ExpenseApprovalComponent />
    </AccessUserComponent>
);

export const AUVacationDoc = () => (
    <AccessUserComponent>
        <VacationDocComponent />
    </AccessUserComponent>
);
export const AUMainContent = () => (
    <AccessUserComponent>
        <MainContentComponent />
    </AccessUserComponent>
);

export const AUMyPage = () => (
    <AccessUserComponent>
        <MyPageComponent />
    </AccessUserComponent>
);

export const AUTimeTableList = () => (
    <AccessUserComponent>
        <TimeTableListComponent />
    </AccessUserComponent>
);

export const AUVacationList = () => (
    <AccessUserComponent>
        <VacationListComponent />
    </AccessUserComponent>
);

export const AUMeetingList = () => (
    <AccessUserComponent>
        <MinutesListComponent/>
    </AccessUserComponent>
);

export const AUMeetingDetail = () => (
    <AccessUserComponent>
        <MinutesDetailComponent/>
    </AccessUserComponent>
);

export const AUMeetingForm = () => (
    <AccessUserComponent>
        <MinutesFormComponent/>
    </AccessUserComponent>
);