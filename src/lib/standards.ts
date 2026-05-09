import { STANDARD_IDS, type StandardId } from './constants';
import type { StandardDef } from './types';

// =============================================================================
// AIKDCL — Bộ tiêu chuẩn kiểm định (Module 2 — Thư viện Bộ tiêu chuẩn)
//
// Lưu ý:
//   - Đây là DỮ LIỆU. Không nhúng prompt template hoặc UI string vào đây
//     để có thể thêm chuẩn mới mà không đụng prompt / page.
//   - Mỗi tiêu chí có `evidenceHints` để AI biết loại minh chứng nào nên gợi ý.
//   - Khi thêm chuẩn mới (ABET, FIBAA, CDIO...), append vào `STANDARDS` và
//     bổ sung vào `STANDARD_IDS` trong constants.ts để type-safe.
// =============================================================================

const AUN_QA_V4: StandardDef = {
  id: STANDARD_IDS.aunQaV4,
  name: 'AUN-QA cấp chương trình đào tạo (phiên bản 4.0)',
  shortName: 'AUN-QA v4',
  version: '4.0',
  description:
    'Bộ tiêu chuẩn đảm bảo chất lượng cấp chương trình đào tạo của Mạng lưới các trường đại học ASEAN (AUN-QA), gồm 8 tiêu chuẩn — 53 tiêu chí. Áp dụng cho hầu hết chương trình ĐH ở Việt Nam tham gia kiểm định AUN-QA.',
  scoreScale: {
    min: 1,
    max: 7,
    labels: {
      1: 'Hoàn toàn không đạt',
      2: 'Chưa đáp ứng, cần cải tiến đáng kể',
      3: 'Cải tiến được phần nào, vẫn chưa đáp ứng',
      4: 'Đáp ứng theo đúng yêu cầu',
      5: 'Tốt hơn yêu cầu',
      6: 'Mẫu mực',
      7: 'Xuất sắc, đẳng cấp thế giới',
    },
  },
  sections: [
    {
      id: '1',
      name: 'Kết quả học tập mong đợi (Expected Learning Outcomes)',
      criteria: [
        {
          id: '1.1',
          text: 'Kết quả học tập mong đợi (ELO) được xây dựng phù hợp với tầm nhìn, sứ mạng của trường/khoa.',
          evidenceHints: [
            'Quyết định ban hành CTĐT',
            'Tầm nhìn sứ mạng nhà trường',
            'Biên bản hội đồng khoa',
          ],
        },
        {
          id: '1.2',
          text: 'ELO phản ánh yêu cầu của các bên liên quan (sinh viên, doanh nghiệp, cựu SV, giảng viên).',
          evidenceHints: [
            'Khảo sát doanh nghiệp',
            'Khảo sát cựu sinh viên',
            'Báo cáo các bên liên quan',
          ],
        },
        {
          id: '1.3',
          text: 'ELO bao gồm cả kết quả tổng quát và chuyên ngành, có thể đo lường được.',
          evidenceHints: ['Ma trận PLO', 'Bảng mô tả PLO chi tiết'],
        },
        {
          id: '1.4',
          text: 'ELO được công bố và phổ biến cho các bên liên quan.',
          evidenceHints: ['Website CTĐT', 'Brochure', 'Sổ tay sinh viên'],
        },
      ],
    },
    {
      id: '2',
      name: 'Mô tả chương trình đào tạo (Programme Specification)',
      criteria: [
        {
          id: '2.1',
          text: 'Thông tin về CTĐT đầy đủ và cập nhật.',
          evidenceHints: ['Bản mô tả CTĐT', 'Đề cương CTĐT'],
        },
        {
          id: '2.2',
          text: 'Mô tả học phần đầy đủ và cập nhật.',
          evidenceHints: ['Đề cương học phần', 'Syllabus chi tiết'],
        },
        {
          id: '2.3',
          text: 'Mô tả CTĐT và học phần được công bố và dễ tiếp cận đối với các bên liên quan.',
          evidenceHints: ['Cổng thông tin sinh viên', 'LMS'],
        },
      ],
    },
    {
      id: '3',
      name: 'Cấu trúc và nội dung chương trình (Programme Structure & Content)',
      criteria: [
        {
          id: '3.1',
          text: 'Nội dung CTĐT thể hiện sự cân bằng giữa kiến thức cơ bản, chuyên ngành và rèn luyện kỹ năng.',
          evidenceHints: ['Khung CTĐT', 'Bảng thống kê tín chỉ theo nhóm'],
        },
        {
          id: '3.2',
          text: 'CTĐT phản ánh tầm nhìn và sứ mạng của nhà trường.',
          evidenceHints: ['Biên bản xây dựng CTĐT'],
        },
        {
          id: '3.3',
          text: 'Đóng góp của mỗi học phần để đạt được ELO rõ ràng.',
          evidenceHints: ['Ma trận học phần - PLO', 'Đề cương học phần'],
        },
        {
          id: '3.4',
          text: 'CTĐT có cấu trúc, trình tự logic, phối hợp giữa các học phần.',
          evidenceHints: ['Sơ đồ học phần tiên quyết', 'Lộ trình đào tạo'],
        },
        {
          id: '3.5',
          text: 'CTĐT được rà soát định kỳ để đảm bảo tính cập nhật.',
          evidenceHints: ['Biên bản họp rà soát CTĐT', 'Bản so sánh các phiên bản'],
        },
      ],
    },
    {
      id: '4',
      name: 'Phương pháp giảng dạy và học tập (Teaching & Learning Approach)',
      criteria: [
        {
          id: '4.1',
          text: 'Triết lý giáo dục và/hoặc phương pháp giảng dạy được xác định rõ và phổ biến.',
          evidenceHints: ['Tuyên bố triết lý GD', 'Quy chế đào tạo'],
        },
        {
          id: '4.2',
          text: 'Hoạt động dạy-học hỗ trợ việc đạt ELO.',
          evidenceHints: ['Đề cương học phần', 'Kế hoạch giảng dạy', 'Kịch bản tiết học'],
        },
        {
          id: '4.3',
          text: 'Hoạt động dạy-học khuyến khích học tập suốt đời.',
          evidenceHints: ['Hoạt động ngoại khóa', 'Câu lạc bộ học thuật'],
        },
      ],
    },
    {
      id: '5',
      name: 'Đánh giá kết quả học tập của sinh viên (Student Assessment)',
      criteria: [
        {
          id: '5.1',
          text: 'Hình thức đánh giá được công bố trước, đa dạng, rõ ràng.',
          evidenceHints: ['Đề cương học phần (rubric)', 'Sổ tay đánh giá'],
        },
        {
          id: '5.2',
          text: 'Đánh giá phản ánh được mức độ đạt ELO.',
          evidenceHints: ['Ma trận đánh giá - CLO/PLO', 'Đề thi mẫu', 'Rubric'],
        },
        {
          id: '5.3',
          text: 'Tính phản hồi cho sinh viên kịp thời.',
          evidenceHints: ['Mẫu phản hồi điểm', 'Khảo sát sinh viên về phản hồi'],
        },
        {
          id: '5.4',
          text: 'Quy trình khiếu nại và phúc khảo rõ ràng.',
          evidenceHints: ['Quy chế phúc khảo', 'Mẫu đơn khiếu nại'],
        },
        {
          id: '5.5',
          text: 'Kết quả đánh giá được rà soát và đảm bảo tính chính xác.',
          evidenceHints: ['Biên bản rà soát điểm', 'Đối sánh chuẩn đầu ra'],
        },
      ],
    },
    {
      id: '6',
      name: 'Đội ngũ giảng viên (Academic Staff)',
      criteria: [
        {
          id: '6.1',
          text: 'Quy hoạch nguồn nhân lực giảng viên đáp ứng quy mô và yêu cầu CTĐT.',
          evidenceHints: ['Đề án vị trí việc làm', 'Quy hoạch nhân sự khoa'],
        },
        {
          id: '6.2',
          text: 'Tuyển dụng, bổ nhiệm, đề bạt dựa trên năng lực học thuật rõ ràng.',
          evidenceHints: ['Quy chế tuyển dụng', 'Tiêu chuẩn chức danh'],
        },
        {
          id: '6.3',
          text: 'Năng lực giảng viên được xác định và đánh giá.',
          evidenceHints: ['Phiếu đánh giá giảng viên', 'KPI giảng viên'],
        },
        {
          id: '6.4',
          text: 'Khối lượng công việc giảng viên hợp lý.',
          evidenceHints: ['Bảng phân công giảng dạy', 'Định mức giờ chuẩn'],
        },
        {
          id: '6.5',
          text: 'Hoạt động bồi dưỡng, phát triển chuyên môn được thực hiện thường xuyên.',
          evidenceHints: ['Kế hoạch tập huấn', 'Chứng chỉ tham dự hội thảo'],
        },
        {
          id: '6.6',
          text: 'Hoạt động NCKH của giảng viên được đẩy mạnh.',
          evidenceHints: ['Danh mục bài báo Scopus/ISI', 'Đề tài NCKH'],
        },
        {
          id: '6.7',
          text: 'Loại hình và số lượng nghiên cứu được giám sát.',
          evidenceHints: ['Báo cáo NCKH hàng năm'],
        },
      ],
    },
    {
      id: '7',
      name: 'Dịch vụ hỗ trợ sinh viên (Student Support Services)',
      criteria: [
        {
          id: '7.1',
          text: 'Có hệ thống tuyển sinh và nhập học rõ ràng.',
          evidenceHints: ['Đề án tuyển sinh', 'Quy chế tuyển sinh'],
        },
        {
          id: '7.2',
          text: 'Có hệ thống cố vấn học tập, hỗ trợ sinh viên.',
          evidenceHints: ['Sổ tay cố vấn học tập', 'Báo cáo CVHT'],
        },
        {
          id: '7.3',
          text: 'Hoạt động ngoại khóa và môi trường học tập hỗ trợ phát triển toàn diện.',
          evidenceHints: ['Kế hoạch hoạt động Đoàn-Hội', 'Báo cáo ngoại khóa'],
        },
        {
          id: '7.4',
          text: 'Cơ chế cố vấn hướng nghiệp và hỗ trợ tâm lý.',
          evidenceHints: ['Quy chế tư vấn tâm lý', 'Báo cáo việc làm cựu SV'],
        },
      ],
    },
    {
      id: '8',
      name: 'Đầu ra (Output and Outcomes)',
      criteria: [
        {
          id: '8.1',
          text: 'Tỷ lệ tốt nghiệp và bỏ học được giám sát, phân tích, cải tiến.',
          evidenceHints: ['Báo cáo tỷ lệ tốt nghiệp', 'Báo cáo dropout'],
        },
        {
          id: '8.2',
          text: 'Thời gian tốt nghiệp trung bình được giám sát, phân tích, cải tiến.',
          evidenceHints: ['Bảng thống kê thời gian học'],
        },
        {
          id: '8.3',
          text: 'Tỷ lệ sinh viên có việc làm được giám sát.',
          evidenceHints: ['Khảo sát việc làm cựu SV', 'Báo cáo việc làm sau 6 tháng'],
        },
        {
          id: '8.4',
          text: 'Hoạt động NCKH của sinh viên được giám sát.',
          evidenceHints: ['Hội nghị SVNCKH', 'Bài báo SV'],
        },
        {
          id: '8.5',
          text: 'Mức độ hài lòng của các bên liên quan được đo lường.',
          evidenceHints: [
            'Kết quả khảo sát SV',
            'Khảo sát cựu SV',
            'Khảo sát doanh nghiệp',
          ],
        },
      ],
    },
  ],
};

const MOET_TT04: StandardDef = {
  id: STANDARD_IDS.moetTt04,
  name: 'Tiêu chuẩn đánh giá chất lượng CTĐT — Thông tư 04/2016/TT-BGDĐT',
  shortName: 'MOET TT04',
  version: '04/2016/TT-BGDĐT',
  description:
    'Bộ tiêu chuẩn đánh giá chất lượng chương trình đào tạo các trình độ giáo dục đại học do Bộ GD&ĐT ban hành theo Thông tư số 04/2016/TT-BGDĐT, gồm 11 tiêu chuẩn — 50 tiêu chí.',
  scoreScale: {
    min: 1,
    max: 7,
    labels: {
      1: 'Hoàn toàn không đáp ứng',
      4: 'Đáp ứng yêu cầu (đạt)',
      7: 'Vượt trội, đẳng cấp quốc tế',
    },
  },
  sections: [
    {
      id: 'TC1',
      name: 'Mục tiêu và chuẩn đầu ra của CTĐT',
      criteria: [
        { id: '1.1', text: 'Mục tiêu của CTĐT được xác định rõ ràng, phù hợp sứ mạng và tầm nhìn.' },
        { id: '1.2', text: 'Chuẩn đầu ra của CTĐT được xác định rõ ràng, đáp ứng yêu cầu của các bên liên quan.' },
        { id: '1.3', text: 'Chuẩn đầu ra phản ánh được yêu cầu nghề nghiệp.' },
      ],
    },
    {
      id: 'TC2',
      name: 'Bản mô tả chương trình đào tạo',
      criteria: [
        { id: '2.1', text: 'Bản mô tả CTĐT đầy đủ thông tin và cập nhật.' },
        { id: '2.2', text: 'Bản mô tả các học phần đầy đủ thông tin và cập nhật.' },
        { id: '2.3', text: 'Bản mô tả CTĐT và bản mô tả học phần được công bố công khai và dễ tiếp cận.' },
      ],
    },
    {
      id: 'TC3',
      name: 'Cấu trúc và nội dung chương trình dạy học',
      criteria: [
        { id: '3.1', text: 'Chương trình dạy học được thiết kế dựa trên chuẩn đầu ra.' },
        { id: '3.2', text: 'Đóng góp của mỗi học phần trong việc đạt chuẩn đầu ra rõ ràng.' },
        { id: '3.3', text: 'Chương trình dạy học có cấu trúc, trình tự logic, có sự gắn kết các học phần.' },
      ],
    },
    {
      id: 'TC4',
      name: 'Phương pháp tiếp cận trong dạy và học',
      criteria: [
        { id: '4.1', text: 'Triết lý giáo dục/mục tiêu giáo dục được tuyên bố rõ ràng.' },
        { id: '4.2', text: 'Các hoạt động dạy và học được thiết kế phù hợp để đạt chuẩn đầu ra.' },
        { id: '4.3', text: 'Các hoạt động dạy và học thúc đẩy việc rèn luyện kỹ năng và học tập suốt đời.' },
      ],
    },
    {
      id: 'TC5',
      name: 'Đánh giá kết quả học tập của người học',
      criteria: [
        { id: '5.1', text: 'Việc đánh giá kết quả học tập được thiết kế phù hợp với mức độ đạt chuẩn đầu ra.' },
        { id: '5.2', text: 'Các quy định về đánh giá kết quả học tập rõ ràng và được phổ biến.' },
        { id: '5.3', text: 'Phương pháp đánh giá đa dạng, đảm bảo độ tin cậy và công bằng.' },
        { id: '5.4', text: 'Phản hồi kết quả đánh giá kịp thời để cải thiện học tập.' },
        { id: '5.5', text: 'Người học được tiếp cận quy trình khiếu nại kết quả đánh giá.' },
      ],
    },
    {
      id: 'TC6',
      name: 'Đội ngũ giảng viên, nghiên cứu viên',
      criteria: [
        { id: '6.1', text: 'Có hệ thống quy hoạch và phát triển đội ngũ giảng viên.' },
        { id: '6.2', text: 'Tỷ lệ giảng viên/người học và khối lượng công việc của giảng viên hợp lý.' },
        { id: '6.3', text: 'Tiêu chí tuyển dụng, bổ nhiệm, đề bạt rõ ràng.' },
        { id: '6.4', text: 'Năng lực giảng viên được đánh giá định kỳ.' },
        { id: '6.5', text: 'Hoạt động đào tạo, bồi dưỡng được thực hiện thường xuyên.' },
        { id: '6.6', text: 'Đãi ngộ và khen thưởng dựa trên hiệu quả công việc.' },
        { id: '6.7', text: 'Hoạt động nghiên cứu khoa học của giảng viên được đẩy mạnh.' },
      ],
    },
    {
      id: 'TC7',
      name: 'Đội ngũ nhân viên',
      criteria: [
        { id: '7.1', text: 'Có hệ thống quy hoạch và phát triển đội ngũ nhân viên.' },
        { id: '7.2', text: 'Tỷ lệ nhân viên/người học hợp lý.' },
        { id: '7.3', text: 'Tiêu chí tuyển dụng và đề bạt rõ ràng.' },
        { id: '7.4', text: 'Năng lực nhân viên được đánh giá định kỳ.' },
        { id: '7.5', text: 'Hoạt động đào tạo, bồi dưỡng được thực hiện thường xuyên.' },
      ],
    },
    {
      id: 'TC8',
      name: 'Người học và hoạt động hỗ trợ người học',
      criteria: [
        { id: '8.1', text: 'Chính sách tuyển sinh được công bố rõ ràng.' },
        { id: '8.2', text: 'Quy trình tuyển sinh đảm bảo công bằng, minh bạch.' },
        { id: '8.3', text: 'Có hệ thống giám sát tiến độ học tập của người học.' },
        { id: '8.4', text: 'Có hệ thống tư vấn học tập, ngoại khóa, dịch vụ hỗ trợ.' },
        { id: '8.5', text: 'Môi trường tâm lý-xã hội và tinh thần thuận lợi cho người học.' },
      ],
    },
    {
      id: 'TC9',
      name: 'Cơ sở vật chất và trang thiết bị',
      criteria: [
        { id: '9.1', text: 'Có đủ giảng đường, phòng học đáp ứng yêu cầu CTĐT.' },
        { id: '9.2', text: 'Có đủ thư viện và học liệu.' },
        { id: '9.3', text: 'Có đủ phòng thí nghiệm, thực hành.' },
        { id: '9.4', text: 'Hệ thống công nghệ thông tin đáp ứng yêu cầu dạy-học và quản lý.' },
        { id: '9.5', text: 'Đảm bảo môi trường, an toàn lao động, vệ sinh.' },
      ],
    },
    {
      id: 'TC10',
      name: 'Nâng cao chất lượng',
      criteria: [
        { id: '10.1', text: 'Thông tin các bên liên quan được khảo sát để cải tiến CTĐT.' },
        { id: '10.2', text: 'Quá trình dạy-học được rà soát, cải tiến để đạt chuẩn đầu ra.' },
        { id: '10.3', text: 'Hoạt động kiểm tra đánh giá được cải tiến để đảm bảo phù hợp.' },
        { id: '10.4', text: 'Chất lượng dịch vụ hỗ trợ người học được rà soát, cải tiến.' },
        { id: '10.5', text: 'Hệ thống đảm bảo chất lượng được giám sát và cải tiến.' },
        { id: '10.6', text: 'Cơ chế phản hồi với các bên liên quan đầy đủ và hiệu quả.' },
      ],
    },
    {
      id: 'TC11',
      name: 'Kết quả đầu ra',
      criteria: [
        { id: '11.1', text: 'Tỷ lệ tốt nghiệp và bỏ học được giám sát, phân tích.' },
        { id: '11.2', text: 'Thời gian tốt nghiệp trung bình được giám sát, phân tích.' },
        { id: '11.3', text: 'Tỷ lệ người học có việc làm sau tốt nghiệp được giám sát.' },
        { id: '11.4', text: 'Hoạt động NCKH của người học được giám sát.' },
        { id: '11.5', text: 'Mức độ hài lòng của các bên liên quan được đo lường định kỳ.' },
      ],
    },
  ],
};

export const STANDARDS: StandardDef[] = [AUN_QA_V4, MOET_TT04];

export function getStandard(id: StandardId): StandardDef {
  const s = STANDARDS.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown standard: ${id}`);
  return s;
}

export function getStandardOrNull(id: string): StandardDef | null {
  return STANDARDS.find((x) => x.id === id) ?? null;
}

export interface CriterionRef {
  id: string;
  text: string;
  evidenceHints?: string[];
}

export function listCriteria(
  id: StandardId,
): Array<{ sectionId: string; sectionName: string; criterion: CriterionRef }> {
  const out: Array<{
    sectionId: string;
    sectionName: string;
    criterion: CriterionRef;
  }> = [];
  for (const sec of getStandard(id).sections) {
    for (const c of sec.criteria) {
      out.push({
        sectionId: sec.id,
        sectionName: sec.name,
        criterion: { id: c.id, text: c.text, evidenceHints: c.evidenceHints },
      });
    }
  }
  return out;
}
