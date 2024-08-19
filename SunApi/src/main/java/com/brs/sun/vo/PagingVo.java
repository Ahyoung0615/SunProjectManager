package com.brs.sun.vo;

import java.util.List;

public class PagingVo<T> {
    private int page;        // 현재 페이지
    private int countList;   // 페이지당 보여줄 게시글 수
    private int totalCount;  // 전체 게시글 수
    private int countPage;   // 페이지 그룹당 페이지 수
    private int totalPage;   // 전체 페이지 수
    private int stagePage;   // 현재 페이지 그룹의 시작 페이지 번호
    private int endPage;     // 현재 페이지 그룹의 마지막 페이지 번호
    private List<T> content; // 페이지에 해당하는 게시글 목록

    public PagingVo(int page, int countList, int totalCount, int countPage) {
        this.page = page;
        this.countList = countList;
        this.totalCount = totalCount;
        this.countPage = countPage;
        this.totalPage = calculateTotalPage(totalCount, countList);
        this.stagePage = calculateStagePage(page, countPage);
        this.endPage = calculateEndPage(stagePage, countPage, totalPage);
    }

    // Getters and Setters
    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
        updateStageAndEndPage();
    }

    public int getCountList() {
        return countList;
    }

    public void setCountList(int countList) {
        this.countList = countList;
        this.totalPage = calculateTotalPage(totalCount, countList);
        updateStageAndEndPage();
    }

    public int getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(int totalCount) {
        this.totalCount = totalCount;
        this.totalPage = calculateTotalPage(totalCount, countList);
        updateStageAndEndPage();
    }

    public int getCountPage() {
        return countPage;
    }

    public void setCountPage(int countPage) {
        this.countPage = countPage;
        updateStageAndEndPage();
    }

    public int getTotalPage() {
        return totalPage;
    }

    public int getStagePage() {
        return stagePage;
    }

    public int getEndPage() {
        return endPage;
    }

    public List<T> getContent() {
        return content;
    }

    public void setContent(List<T> content) {
        this.content = content;
    }

    // 전체 페이지 수 계산
    private int calculateTotalPage(int totalCount, int countList) {
        int totalPage = totalCount / countList;
        if (totalCount % countList > 0) {
            totalPage++;
        }
        return totalPage;
    }

    // 시작 페이지 번호 계산
    private int calculateStagePage(int page, int countPage) {
        return ((page - 1) / countPage) * countPage + 1;
    }

    // 마지막 페이지 번호 계산
    private int calculateEndPage(int stagePage, int countPage, int totalPage) {
        int endPage = stagePage + countPage - 1;
        if (endPage > totalPage) {
            endPage = totalPage;
        }
        return endPage;
    }

    // 페이지, 시작 페이지, 끝 페이지 업데이트
    private void updateStageAndEndPage() {
        this.stagePage = calculateStagePage(page, countPage);
        this.endPage = calculateEndPage(stagePage, countPage, totalPage);
    }
}
