import { createClient } from '@supabase/supabase-js'

// 환경 변수에서 Supabase 설정 가져오기
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const tempUserId = '0ac96e34-aec5-4951-ba76-3bdd6730d7e2'

async function seedTestData() {
  console.log('테스트 데이터 생성을 시작합니다...')

  try {
    // 1. 사용자 데이터 생성
    console.log('사용자 데이터 생성 중...')
    const { error: userError } = await supabase
      .from('users')
      .upsert({
        id: tempUserId,
        email: 'test@example.com',
        nickname: '테스트 사용자',
        school: '테스트 대학교',
        major: '컴퓨터공학과',
        notification_prefs: {
          wrongAnswerAlert: true,
          weeklyReport: false,
          newFeatureAlert: true
        }
      })

    if (userError) {
      console.error('사용자 데이터 생성 실패:', userError)
      return
    }

    // 2. 요약 데이터 생성
    console.log('요약 데이터 생성 중...')
    const summaries = [
      {
        id: '1',
        user_id: tempUserId,
        subject: '웹 개발',
        week: '1주차',
        title: 'HTML과 CSS 기초',
        content: 'HTML은 웹 페이지의 구조를 정의하는 마크업 언어입니다...',
        created_at: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        user_id: tempUserId,
        subject: '웹 개발',
        week: '2주차',
        title: 'JavaScript 기초 문법',
        content: 'JavaScript는 웹 브라우저에서 실행되는 프로그래밍 언어입니다...',
        created_at: '2024-01-20T14:00:00Z'
      },
      {
        id: '3',
        user_id: tempUserId,
        subject: '알고리즘',
        week: '1주차',
        title: '정렬 알고리즘',
        content: '정렬 알고리즘은 데이터를 특정 순서로 배열하는 알고리즘입니다...',
        created_at: '2024-01-22T09:00:00Z'
      },
      {
        id: '4',
        user_id: tempUserId,
        subject: '데이터베이스',
        week: '1주차',
        title: 'SQL 기초',
        content: 'SQL은 관계형 데이터베이스에서 데이터를 조작하는 언어입니다...',
        created_at: '2024-01-25T16:00:00Z'
      },
      {
        id: '5',
        user_id: tempUserId,
        subject: '웹 개발',
        week: '3주차',
        title: 'React 컴포넌트',
        content: 'React 컴포넌트는 UI를 구성하는 재사용 가능한 블록입니다...',
        created_at: '2024-01-28T11:00:00Z'
      }
    ]

    for (const summary of summaries) {
      const { error } = await supabase
        .from('summaries')
        .upsert(summary)
      
      if (error) {
        console.error('요약 데이터 생성 실패:', error)
      }
    }

    // 3. 퀴즈 데이터 생성
    console.log('퀴즈 데이터 생성 중...')
    const quizzes = [
      {
        id: '1',
        user_id: tempUserId,
        subject: '웹 개발',
        week: '1주차',
        questions: [
          {
            type: 'multiple',
            question: 'HTML에서 제목을 나타내는 태그는?',
            options: ['<p>', '<h1>', '<div>', '<span>'],
            answer: '<h1>',
            explanation: 'HTML에서 제목은 h1~h6 태그를 사용합니다.'
          }
        ],
        total_questions: 5,
        correct_answers: 4,
        completed_at: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        user_id: tempUserId,
        subject: '웹 개발',
        week: '2주차',
        questions: [
          {
            type: 'multiple',
            question: 'JavaScript에서 변수를 선언하는 키워드는?',
            options: ['var', 'let', 'const', '모두'],
            answer: '모두',
            explanation: 'JavaScript에서는 var, let, const 모두 변수 선언에 사용됩니다.'
          }
        ],
        total_questions: 5,
        correct_answers: 5,
        completed_at: '2024-01-20T14:15:00Z'
      },
      {
        id: '3',
        user_id: tempUserId,
        subject: '알고리즘',
        week: '1주차',
        questions: [
          {
            type: 'multiple',
            question: '버블 정렬의 시간 복잡도는?',
            options: ['O(n)', 'O(n²)', 'O(log n)', 'O(n log n)'],
            answer: 'O(n²)',
            explanation: '버블 정렬은 이중 반복문을 사용하므로 O(n²) 시간 복잡도를 가집니다.'
          }
        ],
        total_questions: 5,
        correct_answers: 3,
        completed_at: '2024-01-22T09:45:00Z'
      },
      {
        id: '4',
        user_id: tempUserId,
        subject: '데이터베이스',
        week: '1주차',
        questions: [
          {
            type: 'multiple',
            question: 'SQL에서 데이터를 조회하는 명령어는?',
            options: ['INSERT', 'SELECT', 'UPDATE', 'DELETE'],
            answer: 'SELECT',
            explanation: 'SELECT는 데이터를 조회하는 SQL 명령어입니다.'
          }
        ],
        total_questions: 5,
        correct_answers: 4,
        completed_at: '2024-01-25T16:20:00Z'
      },
      {
        id: '5',
        user_id: tempUserId,
        subject: '웹 개발',
        week: '3주차',
        questions: [
          {
            type: 'multiple',
            question: 'React에서 상태를 관리하는 Hook은?',
            options: ['useState', 'useEffect', 'useContext', '모두'],
            answer: '모두',
            explanation: 'React에서는 여러 Hook을 사용하여 상태를 관리할 수 있습니다.'
          }
        ],
        total_questions: 5,
        correct_answers: 5,
        completed_at: '2024-01-28T11:10:00Z'
      }
    ]

    for (const quiz of quizzes) {
      const { error } = await supabase
        .from('quizzes')
        .upsert(quiz)
      
      if (error) {
        console.error('퀴즈 데이터 생성 실패:', error)
      }
    }

    // 4. 오답 노트 데이터 생성
    console.log('오답 노트 데이터 생성 중...')
    const wrongAnswers = [
      {
        quiz_id: '1',
        user_id: tempUserId,
        question_index: 0,
        user_answer: '<p>',
        correct_answer: '<h1>',
        explanation: 'HTML에서 제목은 h1~h6 태그를 사용합니다. p 태그는 문단을 나타냅니다.'
      },
      {
        quiz_id: '3',
        user_id: tempUserId,
        question_index: 0,
        user_answer: 'O(n)',
        correct_answer: 'O(n²)',
        explanation: '버블 정렬은 이중 반복문을 사용하므로 O(n²) 시간 복잡도를 가집니다.'
      },
      {
        quiz_id: '3',
        user_id: tempUserId,
        question_index: 1,
        user_answer: 'O(log n)',
        correct_answer: 'O(n²)',
        explanation: '버블 정렬은 이중 반복문을 사용하므로 O(n²) 시간 복잡도를 가집니다.'
      },
      {
        quiz_id: '4',
        user_id: tempUserId,
        question_index: 0,
        user_answer: 'INSERT',
        correct_answer: 'SELECT',
        explanation: 'SELECT는 데이터를 조회하는 SQL 명령어입니다. INSERT는 데이터를 삽입하는 명령어입니다.'
      }
    ]

    for (const wrongAnswer of wrongAnswers) {
      const { error } = await supabase
        .from('wrong_answers')
        .upsert(wrongAnswer)
      
      if (error) {
        console.error('오답 노트 데이터 생성 실패:', error)
      }
    }

    console.log('테스트 데이터 생성이 완료되었습니다!')

  } catch (error) {
    console.error('테스트 데이터 생성 중 오류 발생:', error)
  }
}

// 스크립트 실행
seedTestData() 