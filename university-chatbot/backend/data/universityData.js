// University data structure for the chatbot
const universityData = {
  academicPrograms: {
    scienceBiology: {
      courses: [
        {
          name: "General Biology I & II",
          code: "BIOL 101-102",
          description: "Introduction to fundamental biological concepts including cell biology, genetics, and ecology",
          link: "/academics/biology/general-biology"
        },
        {
          name: "Organic Chemistry",
          code: "CHEM 301-302",
          description: "Comprehensive study of organic compounds and reactions",
          link: "/academics/chemistry/organic-chemistry"
        },
        {
          name: "Microbiology",
          code: "BIOL 310",
          description: "Study of microorganisms and their role in disease and environmental processes",
          link: "/academics/biology/microbiology"
        },
        {
          name: "Molecular Biology",
          code: "BIOL 420",
          description: "Advanced study of DNA, RNA, and protein synthesis",
          link: "/academics/biology/molecular-biology"
        }
      ]
    },
    artsSciences: {
      majors: [
        {
          name: "English Literature",
          department: "English",
          description: "Study of literature from various periods and cultures",
          link: "/academics/english/literature"
        },
        {
          name: "Psychology",
          department: "Psychology", 
          description: "Scientific study of human behavior and mental processes",
          link: "/academics/psychology"
        },
        {
          name: "History",
          department: "History",
          description: "Study of past events and their impact on society",
          link: "/academics/history"
        },
        {
          name: "Philosophy",
          department: "Philosophy",
          description: "Critical thinking about fundamental questions of existence",
          link: "/academics/philosophy"
        },
        {
          name: "Mathematics",
          department: "Mathematics",
          description: "Pure and applied mathematics including calculus, statistics, and discrete mathematics",
          link: "/academics/mathematics"
        }
      ]
    },
    dataScience: {
      programs: [
        {
          name: "Bachelor of Science in Data Science",
          type: "Undergraduate",
          description: "Comprehensive program covering statistics, machine learning, and data analysis",
          requirements: ["Mathematics through Calculus II", "Introduction to Programming", "Statistics"],
          link: "/academics/data-science/bachelor"
        },
        {
          name: "Master of Science in Data Analytics",
          type: "Graduate",
          description: "Advanced program for professionals seeking expertise in big data and analytics",
          requirements: ["Bachelor's degree", "Programming experience", "Statistics background"],
          link: "/academics/data-science/master"
        },
        {
          name: "Data Science Certificate",
          type: "Certificate",
          description: "Professional certificate program for working professionals",
          duration: "12 months part-time",
          link: "/academics/data-science/certificate"
        }
      ]
    }
  },
  
  admissions: {
    undergraduate: {
      requirements: [
        "High school diploma or equivalent",
        "Minimum GPA of 3.0",
        "SAT scores (optional for 2024-2025)",
        "Two letters of recommendation",
        "Personal essay"
      ],
      deadlines: {
        earlyAction: "November 15",
        regularDecision: "February 1",
        transfer: "Rolling basis"
      },
      link: "/admissions/undergraduate"
    },
    international: {
      requirements: [
        "TOEFL score of 80+ or IELTS 6.5+",
        "Credential evaluation",
        "Financial documentation",
        "Valid passport"
      ],
      deadlines: {
        fall: "May 1",
        spring: "October 1"
      },
      link: "/admissions/international"
    },
    testOptional: {
      policy: "SAT/ACT scores are optional for undergraduate admissions through 2025",
      alternatives: ["Portfolio submission", "Interview", "Additional essays"],
      link: "/admissions/test-optional"
    }
  },
  
  tuitionFees: {
    undergraduate: {
      inState: {
        tuition: "$12,500",
        fees: "$1,200",
        total: "$13,700"
      },
      outOfState: {
        tuition: "$28,900",
        fees: "$1,200", 
        total: "$30,100"
      },
      link: "/financial-aid/tuition-fees"
    },
    scholarships: {
      transfer: [
        {
          name: "Transfer Excellence Scholarship",
          amount: "Up to $5,000",
          requirements: ["3.5+ GPA", "30+ transfer credits"],
          link: "/financial-aid/scholarships/transfer-excellence"
        },
        {
          name: "Phi Theta Kappa Scholarship",
          amount: "$2,500",
          requirements: ["PTK membership", "3.25+ GPA"],
          link: "/financial-aid/scholarships/phi-theta-kappa"
        }
      ],
      merit: [
        {
          name: "Presidential Scholarship",
          amount: "Full tuition",
          requirements: ["4.0 GPA", "1450+ SAT or 32+ ACT"],
          link: "/financial-aid/scholarships/presidential"
        }
      ]
    },
    paymentOptions: {
      plans: ["Monthly payment plan", "Semester payment", "Annual payment"],
      methods: ["Credit card", "Bank transfer", "Check"],
      link: "/financial-aid/payment-options"
    }
  },
  
  campusLife: {
    housing: {
      undergraduate: {
        required: "First-year students required to live on campus",
        options: ["Traditional residence halls", "Suite-style", "Apartments"],
        link: "/campus-life/housing/undergraduate"
      },
      graduate: {
        available: true,
        options: ["Graduate apartments", "Family housing"],
        link: "/campus-life/housing/graduate"
      }
    },
    sports: {
      varsity: ["Basketball", "Soccer", "Tennis", "Swimming", "Track & Field", "Baseball", "Softball"],
      intramural: ["Flag football", "Volleyball", "Ultimate frisbee", "Ping pong"],
      facilities: ["Fitness center", "Olympic pool", "Tennis courts", "Basketball courts"],
      link: "/campus-life/athletics"
    },
    mentalHealth: {
      services: [
        "Individual counseling",
        "Group therapy sessions", 
        "Crisis intervention",
        "Stress management workshops"
      ],
      availability: "24/7 crisis hotline available",
      location: "Student Health Center, 2nd floor",
      contact: "555-123-HELP",
      link: "/campus-life/counseling-services"
    }
  }
};

// Button hierarchy configuration
const buttonHierarchy = {
  main: [
    { id: "academic-programs", label: "Academic Programs", icon: "🎓" },
    { id: "admissions", label: "Admissions", icon: "📝" },
    { id: "tuition-fees", label: "Tuition & Fees", icon: "💰" },
    { id: "campus-life", label: "Campus Life & Housing", icon: "🏠" },
    { id: "ask-question", label: "Ask a Question", icon: "💬" }
  ],
  
  subCategories: {
    "academic-programs": [
      { id: "science-biology", label: "Science & Biology Courses", parent: "academic-programs" },
      { id: "arts-sciences", label: "College of Arts & Sciences", parent: "academic-programs" },
      { id: "data-science", label: "Data Science Programs", parent: "academic-programs" },
      { id: "all-majors", label: "Show All Majors", parent: "academic-programs" }
    ],
    
    "admissions": [
      { id: "how-to-apply", label: "How to Apply", parent: "admissions" },
      { id: "international", label: "International Students", parent: "admissions" },
      { id: "test-requirements", label: "Test Score Requirements", parent: "admissions" }
    ],
    
    "tuition-fees": [
      { id: "out-state-tuition", label: "Out-of-State Tuition", parent: "tuition-fees" },
      { id: "transfer-scholarships", label: "Scholarships for Transfers", parent: "tuition-fees" },
      { id: "payment-options", label: "Payment Options", parent: "tuition-fees" }
    ],
    
    "campus-life": [
      { id: "student-housing", label: "Student Housing", parent: "campus-life" },
      { id: "sports-programs", label: "Sports Programs", parent: "campus-life" },
      { id: "mental-health", label: "Mental Health Support", parent: "campus-life" }
    ]
  }
};

module.exports = { universityData, buttonHierarchy };