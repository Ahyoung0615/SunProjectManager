# ☀️ SunProjectManager ☀️


### 주제 : 회사 인트라넷 구축을 위한 그룹웨어 구현

### 기간 : 2024.07.30~2024.09.06(6주)

### 인원 : 3명

----------------------

# 목차

### [1.프로젝트 아키텍쳐](#1-프로젝트-아키텍쳐)
### [2.개발 환경](#2-개발-환경)
### [3.ERD](#3-erd)
   - [3.1 Oracle ShellScript](#31-oracle-shellscript)
### [4.주요 기능(담당한 기능 ☀️)](#4-주요-기능) 
   - [4.1로그인/로그아웃](#41-로그인-로그아웃)
   - [4.2마이페이지](#42-마이페이지)
   - [4.3채팅](#43-채팅)
   - [4.4인사관리](#44-인사관리)
   - [4.5공지사항 게시판](#45-공지사항-게시판)
   - [4.6전자결재](#46-전자결재) ☀️
   - [4.7시설예약](#47-시설예약) ☀️
   - [4.8차량관리](#48-차량관리) 
   - [4.9협력사관리](#49-협력사관리)
   - [4.10출장/배차관리](#410-출장-배차관리)
   - [4.11공휴일 관리](#411-공휴일-관리)
   - [4.12회의록 관리](#412-회의록-관리)
   - [4.13화면제어](#413-화면제어)
### [5.성능 개선](#5-성능-개선)



----------------------


# 1. 프로젝트 아키텍쳐
<br><br>
![스크린샷 2024-09-08 203358](https://github.com/user-attachments/assets/55a519a7-49d3-45c3-b325-c24f2496a492)
<br><br>

# 개발 구조
![스크린샷 2024-09-11 102406](https://github.com/user-attachments/assets/2de7f105-ccf9-4aa3-8e4f-345f9615660f)
<br><br>

# 사용 API
![스크린샷 2024-09-11 102353](https://github.com/user-attachments/assets/51f839ac-882f-481c-bd1e-92f634be063a)




----------------------


# 2. 개발 환경


#### Back-end
![Java](https://img.shields.io/badge/Java-17-brightgreen?style=for-the-badge&logo=java&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.8-brightgreen?style=for-the-badge&logo=springboot&logoColor=white)

#### 통신
![Web Socket](https://img.shields.io/badge/Web%20Socket-Enabled-blue?style=for-the-badge)
![STOMP](https://img.shields.io/badge/STOMP-Enabled-blue?style=for-the-badge)

#### 데이터 처리
![JPA](https://img.shields.io/badge/JPA-Enabled-yellow?style=for-the-badge)
![myBatis](https://img.shields.io/badge/myBatis-Enabled-blue?style=for-the-badge)
![Gson](https://img.shields.io/badge/Gson-Enabled-green?style=for-the-badge)
![Commons FileUpload](https://img.shields.io/badge/Commons%20FileUpload-Enabled-orange?style=for-the-badge)

#### 로깅/유틸
![Lombok](https://img.shields.io/badge/Lombok-Enabled-green?style=for-the-badge)
![AOP](https://img.shields.io/badge/AOP-Enabled-red?style=for-the-badge)


#### Front-end
![JavaScript](https://img.shields.io/badge/JavaScript-Enabled-yellow?style=for-the-badge)
![React](https://img.shields.io/badge/React-Enabled-blue?style=for-the-badge&logo=react)
![Axios Ajax](https://img.shields.io/badge/Axios%20Ajax-Enabled-lightblue?style=for-the-badge)
![Bootstrap](https://img.shields.io/badge/Bootstrap-Enabled-purple?style=for-the-badge)


#### DB
![Oracle 19c](https://img.shields.io/badge/Oracle%2019c-Enabled-red?style=for-the-badge)

#### DB 관리
![Oracle Shell Script](https://img.shields.io/badge/Oracle%20Shell%20Script-Enabled-orange?style=for-the-badge)

#### 캐시 서버
![Redis](https://img.shields.io/badge/Redis-Enabled-red?style=for-the-badge)

#### CI/CD
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-Enabled-blue?style=for-the-badge&logo=githubactions&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue?style=for-the-badge&logo=docker&logoColor=white)
![Ubuntu](https://img.shields.io/badge/Ubuntu%2024.04%20LTS-Enabled-orange?style=for-the-badge&logo=ubuntu&logoColor=white)

#### 네트워크
![ngrok](https://img.shields.io/badge/ngrok-Enabled-blue?style=for-the-badge)

#### 테스트 도구
![JUnit 5.10.3](https://img.shields.io/badge/JUnit-5.10.3-red?style=for-the-badge)
![SpringBootTest](https://img.shields.io/badge/SpringBootTest-3.2.8-brightgreen?style=for-the-badge)
![Postman](https://img.shields.io/badge/Postman-Enabled-orange?style=for-the-badge&logo=postman&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-Enabled-green?style=for-the-badge&logo=swagger&logoColor=white)

#### 형상 관리
![GitHub](https://img.shields.io/badge/GitHub-Enabled-black?style=for-the-badge&logo=github&logoColor=white)




----------------------

# 3. ERD
![image](https://github.com/user-attachments/assets/6d42da66-2e0a-4794-a86d-09cb2610b7a0)




### 3.1 Oracle ShellScript
[DummyData](https://github.com/bluewt129/SunProjectDeploy/raw/OracleData/sun_main_database.sql)




----------------------


## 4. 주요 기능
### 이미지 클릭 시 동영상 링크로 이동됩니다
### 생략된 기능들에 대한 자세한 설명은 해당 기능 담당자 Git으로 이동하면 확인할 수 있습니다


[SONIC GIT 보러가기](https://github.com/Leesehyun49/SunProjectManager)  
[BLUE GIT 보러가기](https://github.com/bluewt129/SunProjectDeploy)


### 4.1 로그인 로그아웃
#### [SONIC GIT 보러가기](https://github.com/Leesehyun49/SunProjectManager)

### 4.2 마이페이지
#### [SONIC GIT 보러가기](https://github.com/Leesehyun49/SunProjectManager)

### 4.3 채팅
#### [SONIC GIT 보러가기](https://github.com/Leesehyun49/SunProjectManager)

### 4.4 인사관리
#### [SONIC GIT 보러가기](https://github.com/Leesehyun49/SunProjectManager)

### 4.5 공지사항 게시판
#### [SONIC GIT 보러가기](https://github.com/Leesehyun49/SunProjectManager)


-----------------------------


### 4.6 전자결재
##### ☀️ 담당기능
[![화면제어 영상](https://img.youtube.com/vi/6ZrtvNUDXRQ/0.jpg)](https://youtu.be/6ZrtvNUDXRQ)

전자결재 기능입니다. 

발신함 / 수신함 : 문서 상태에 따라 탭으로 분리되어 리스트를 볼 수 있습니다. 

수신함은 나의 결재 차례가 아닌 문서는 보이지 않도록 쿼리로 유효성 검사해서 리스트 불러옵니다.

조직도 : jsTree 로 구현한 트리 구조 조직도에서 결재자를 선택할 수 있습니다.

지출 결의서 : CLOVA OCR 로 영수증 내용을 스캔하여 자동으로 값이 작성됩니다.

휴가 신청서 : 남은 연차 유효성 검사로 사용 연차 유효성 검사를 할 수 있습니다. 주말과 공휴일은 사용 연차 갯수 제외 유효성 검사가 됩니다.


-----------------------------


### 4.7 시설예약
##### ☀️ 담당기능
[![화면제어 영상](https://img.youtube.com/vi/uRXPvZnI9bA/0.jpg)](https://youtu.be/uRXPvZnI9bA)

FullCalendar 로 전체 예약 목록을 표시합니다.

GoogleCalendar 에서 공휴일 정보를 불러와서 FullCalendar 에서 표시 해줍니다.

이벤트를 클릭하면 상세 내용이 표시됩니다.

새로운 시설 예약은 시작 시간과 종료 시간 중복 검사 후 중복이 없을 시에만 예약이 가능합니다.

sessionStorage 에 담긴 session 정보와 예약자 정보가 같아야 삭제가 가능합니다.

-----------------------------


### 4.8 차량관리
##### [BLUE GIT 보러가기](https://github.com/bluewt129/SunProjectDeploy)

### 4.9 협력사관리
##### [BLUE GIT 보러가기](https://github.com/bluewt129/SunProjectDeploy)

### 4.10 출장 배차관리
##### [BLUE GIT 보러가기](https://github.com/bluewt129/SunProjectDeploy)

### 4.11 공휴일 관리
##### [BLUE GIT 보러가기](https://github.com/bluewt129/SunProjectDeploy)

### 4.12 회의록 관리
##### [BLUE GIT 보러가기](https://github.com/bluewt129/SunProjectDeploy)

### 4.13 화면제어
##### [BLUE GIT 보러가기](https://github.com/bluewt129/SunProjectDeploy)

-----------------------------


## 5. 성능 개선
### 캘린더 데이터 송수신 속도 개선


#### 1) 기존: 사용자가 페이지 진입 시 프론트 서버에서 컴포넌트 마운트 후 GoogleCalendar API 호출, 화면에 최종 출력 **2.46초** 소요.




#### 2) 1차 개선: 서버에서 1년치 데이터를 미리 요청하여 **0.9초**로 단축.
![image](https://github.com/user-attachments/assets/6858bb65-a5ac-45b0-942d-b1841b172772)




#### 3) 2차 개선: Redis 서버를 이용한 데이터 캐싱으로 **0.4초**로 성능 개선, 과도한 외부 API 호출 방지.
![image](https://github.com/user-attachments/assets/2b811485-1168-4fc8-8a1e-a35129bbcba1)
