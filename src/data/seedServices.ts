import { ServiceItem } from '../types';

export const INITIAL_SERVICES: ServiceItem[] = [
  // --- Category A: Aadhaar Services ---
  {
    id: 'aadhaar-address-update',
    categoryId: 'aadhaar',
    categoryNameBn: 'আধার সেবা',
    categoryNameEn: 'Aadhaar Services',
    titleBn: 'আধার ঠিকানা পরিবর্তন সহায়তা',
    titleEn: 'Aadhaar Address Update Assistance',
    descriptionBn: 'ইউআইডিএআই (UIDAI) এর বর্তমান নিয়মানুযায়ী আধার কার্ডের ঠিকানায় সংশোধন বা আপডেটের আবেদন সহায়তা। বৈধ প্রমাণপত্র প্রয়োজন।',
    descriptionEn: 'Assistance for submitting an online address update on the official UIDAI portal as per current guidelines with valid address proof.',
    active: true,
    officialFee: 50,
    serviceCharge: 100,
    requiredDocuments: [
      'বৈধ ঠিকানার প্রমাণপত্র (ভোটার কার্ড/বিদ্যুৎ বিল/ব্যাঙ্ক পাসবুক/রেশন কার্ড)',
      'আধার কার্ডের কপি',
      'আধার লিঙ্কযুক্ত সক্রিয় মোবাইল নম্বর (ওটিপি প্রাপ্তির জন্য)'
    ],
    officialPortalUrl: 'https://myaadhaar.uidai.gov.in',
    authorizationRequirement: 'মোবাইল নম্বর অবশ্যই আধারে লিঙ্ক থাকতে হবে। আসল কার্ডে পরিবর্তনের জন্য UIDAI পোর্টালে অনলাইন প্রক্রিয়া সম্পন্ন হবে।',
    formSchema: [
      {
        name: 'applicantName',
        labelBn: 'আবেদনকারীর নাম (আধার কার্ড অনুযায়ী)',
        labelEn: 'Applicant Name (as in Aadhaar)',
        type: 'text',
        required: true,
        placeholderBn: 'যেমন: রফিক ইসলাম',
        placeholderEn: 'e.g. Rafiqul Islam'
      },
      {
        name: 'aadhaarLast4',
        labelBn: 'আধার নম্বরের শেষ ৪টি সংখ্যা (নিরাপত্তার স্বার্থে পূর্ণ নম্বর নয়)',
        labelEn: 'Last 4 digits of Aadhaar (No full numbers for safety)',
        type: 'text',
        required: true,
        placeholderBn: 'যেমন: ৮৮৯২',
        placeholderEn: 'e.g. 8892'
      },
      {
        name: 'proposedAddress',
        labelBn: 'সংশোধিত নতুন ঠিকানা (সম্পূর্ণ গ্রাম/রাস্তা, ডাকঘর, জেলা, পিন কোড)',
        labelEn: 'Proposed New Address (Vill/Street, Post, District, PIN Code)',
        type: 'textarea',
        required: true,
        placeholderBn: 'গ্রাম/রাস্তা, ডাকঘর, থানা, জেলা, পিন কোড লিখুন',
        placeholderEn: 'Enter full Village/Town, PO, PS, District, PIN'
      },
      {
        name: 'proofType',
        labelBn: 'ঠিকানার প্রমাণের ধরন',
        labelEn: 'Type of Address Proof Document',
        type: 'select',
        required: true,
        options: [
          { value: 'voter', labelBn: 'ভোটার পরিচয়পত্র (Voter ID)', labelEn: 'Voter ID Card' },
          { value: 'electricity', labelBn: 'বিদ্যুৎ বিল (Electricity Bill)', labelEn: 'Electricity Bill' },
          { value: 'bank_passbook', labelBn: 'ব্যাঙ্ক পাসবুক (Bank Passbook)', labelEn: 'Bank Passbook' },
          { value: 'ration', labelBn: 'রেশন কার্ড (Ration Card)', labelEn: 'Ration Card' },
          { value: 'panchayat_cert', labelBn: 'প্রধান/কাউন্সিলর শংসাপত্র', labelEn: 'Panchayat / Councillor Certificate' }
        ]
      }
    ]
  },
  {
    id: 'aadhaar-name-dob-correction',
    categoryId: 'aadhaar',
    categoryNameBn: 'আধার সেবা',
    categoryNameEn: 'Aadhaar Services',
    titleBn: 'আধার নাম ও জন্মতারিখ সংশোধন নির্দেশনা ও সহায়তা',
    titleEn: 'Aadhaar Name & DOB Correction Assistance',
    descriptionBn: 'আধার কার্ডে নাম বা জন্মতারিখ সংশোধন নির্দেশিকা ও নিকটস্থ অনুমোদিত আধার সেবা কেন্দ্রের অনলাইন অ্যাপয়েন্টমেন্ট বুকিং সহায়তা।',
    descriptionEn: 'Guidance and appointment scheduling assistance for Aadhaar name & date of birth corrections at UIDAI authorized centres.',
    active: true,
    officialFee: 50,
    serviceCharge: 80,
    requiredDocuments: [
      'মাধ্যমিক অ্যাডমিট কার্ড অথবা বার্থ সার্টিফিকেট (জন্মতারিখের জন্য)',
      'প্যান কার্ড বা ভোটার কার্ড (নাম প্রমাণের জন্য)',
      'বর্তমান আধার কার্ড কপি'
    ],
    officialPortalUrl: 'https://appointments.uidai.gov.in',
    authorizationRequirement: 'নাম/জন্মতারিখের নির্দিষ্ট সীমার অতিরিক্ত সংশোধনের ক্ষেত্রে UIDAI আধার সেবা কেন্দ্রে শারীরিক উপস্থিতি বাধ্যতামূলক।',
    formSchema: [
      {
        name: 'applicantName',
        labelBn: 'আবেদনকারীর বর্তমান নাম',
        labelEn: 'Applicant Current Name',
        type: 'text',
        required: true
      },
      {
        name: 'requestedChangeType',
        labelBn: 'সংশোধনের বিষয়',
        labelEn: 'Correction Type',
        type: 'select',
        required: true,
        options: [
          { value: 'name', labelBn: 'নামের বানান সংশোধন', labelEn: 'Name Correction' },
          { value: 'dob', labelBn: 'জন্মতারিখ সংশোধন', labelEn: 'Date of Birth Correction' },
          { value: 'both', labelBn: 'নাম ও জন্মতারিখ উভয়ই', labelEn: 'Both Name and DOB' }
        ]
      },
      {
        name: 'targetCorrectionValue',
        labelBn: 'সংশোধিত সঠিক তথ্য লিখুন',
        labelEn: 'Correct Value to be Updated',
        type: 'text',
        required: true,
        placeholderBn: 'সঠিক বানান বা জন্মতারিখ লিখুন',
        placeholderEn: 'Enter correct spelling or correct date'
      }
    ]
  },
  {
    id: 'aadhaar-mobile-link-guidance',
    categoryId: 'aadhaar',
    categoryNameBn: 'আধার সেবা',
    categoryNameEn: 'Aadhaar Services',
    titleBn: 'আধার মোবাইল নম্বর লিঙ্ক ও বায়োমেট্রিক অ্যাপয়েন্টমেন্ট সহায়তা',
    titleEn: 'Aadhaar Mobile Link & Biometric Appointment Assistance',
    descriptionBn: 'আধারে মোবাইল নম্বর লিঙ্ক করতে বায়োমেট্রিক বাধ্যতামূলক। আমরা নিকটবর্তী ডাকঘর বা আধার কেন্দ্রে দ্রুত অ্যাপয়েন্টমেন্ট বুকিং করে দিই।',
    descriptionEn: 'Mobile linking requires physical biometric verification. We assist with nearest centre slot booking and form filling.',
    active: true,
    officialFee: 50,
    serviceCharge: 60,
    requiredDocuments: [
      'আধার কার্ড কপি',
      'যে নতুন মোবাইল নম্বরটি লিঙ্ক করতে চান'
    ],
    officialPortalUrl: 'https://appointments.uidai.gov.in',
    authorizationRequirement: 'সরাসরি কোনো অ্যাপে ঘরে বসে মোবাইল লিঙ্ক সম্ভব নয়; অনুমোদিত কেন্দ্রে বায়োমেট্রিক আবশ্যক।',
    formSchema: [
      {
        name: 'applicantName',
        labelBn: 'আবেদনকারীর নাম',
        labelEn: 'Applicant Name',
        type: 'text',
        required: true
      },
      {
        name: 'preferredDistrict',
        labelBn: 'আপনার জেলা (পশ্চিমবঙ্গ)',
        labelEn: 'Your District in West Bengal',
        type: 'text',
        required: true,
        placeholderBn: 'যেমন: মুর্শিদাবাদ / নদীয়া / কলকাতা / মালদা',
        placeholderEn: 'e.g. Murshidabad, Nadia, Malda, Kolkata'
      },
      {
        name: 'newMobileNumber',
        labelBn: 'যে মোবাইল নম্বরটি লিঙ্ক করতে চান',
        labelEn: 'Mobile Number to be linked',
        type: 'phone',
        required: true
      }
    ]
  },

  // --- Category B: PAN Card Services ---
  {
    id: 'pan-new-application',
    categoryId: 'pan',
    categoryNameBn: 'প্যান কার্ড সেবা',
    categoryNameEn: 'PAN Card Services',
    titleBn: 'নতুন প্যান কার্ড আবেদন (ফর্ম ৪৯এ) সহায়তা',
    titleEn: 'New PAN Card Application (Form 49A) Assistance',
    descriptionBn: 'ভারতীয় নাগরিকদের জন্য নতুন ডিজিটাল প্যান কার্ড এবং ফিজিক্যাল কার্ডের জন্য আয়কর পোর্টাল/NSDL/UTIITSL-এ আবেদন সহায়তা।',
    descriptionEn: 'Assistance in filing Form 49A for new Physical & e-PAN card on official NSDL/UTIITSL portal.',
    active: true,
    officialFee: 107,
    serviceCharge: 120,
    requiredDocuments: [
      'আধার কার্ড (বাধ্যতামূলক পরিচয় ও ঠিকানার প্রমাণ)',
      '২ কপি পাসপোর্ট সাইজ রঙিন ছবি',
      'স্বাক্ষর বা বুড়ো আঙুলের ছাপ'
    ],
    officialPortalUrl: 'https://onlineservices.nsdl.com',
    authorizationRequirement: 'আবেদনকারীকে বৈধ আধার কার্ড ও ছবি সরবরাহ করতে হবে।',
    formSchema: [
      {
        name: 'applicantName',
        labelBn: 'আবেদনকারীর নাম (আধার অনুযায়ী)',
        labelEn: 'Applicant Full Name',
        type: 'text',
        required: true
      },
      {
        name: 'fatherName',
        labelBn: 'পিতার নাম',
        labelEn: "Father's Full Name",
        type: 'text',
        required: true
      },
      {
        name: 'dob',
        labelBn: 'জন্মতারিখ (DD/MM/YYYY)',
        labelEn: 'Date of Birth',
        type: 'date',
        required: true
      },
      {
        name: 'gender',
        labelBn: 'লিঙ্গ',
        labelEn: 'Gender',
        type: 'radio',
        required: true,
        options: [
          { value: 'male', labelBn: 'পুরুষ', labelEn: 'Male' },
          { value: 'female', labelBn: 'মহিলা', labelEn: 'Female' },
          { value: 'other', labelBn: 'অন্যান্য', labelEn: 'Other' }
        ]
      }
    ]
  },
  {
    id: 'pan-correction',
    categoryId: 'pan',
    categoryNameBn: 'প্যান কার্ড সেবা',
    categoryNameEn: 'PAN Card Services',
    titleBn: 'প্যান কার্ডের ভুল সংশোধন সহায়তা (CSF)',
    titleEn: 'PAN Card Correction / Name / DOB Correction Assistance',
    descriptionBn: 'বিদ্যমান প্যান কার্ডে নাম, পিতার নাম, জন্মতারিখ সংশোধন অথবা নষ্ট/হারিয়ে যাওয়া কার্ড নতুন করে পাওয়ার আবেদন।',
    descriptionEn: 'Assistance for changes or correction in PAN data or reprint of PAN card.',
    active: true,
    officialFee: 107,
    serviceCharge: 120,
    requiredDocuments: [
      'বিদ্যমান প্যান কার্ড বা প্যান অ্যালটমেন্ট লেটার',
      'সঠিক তথ্যের আধার কার্ড কপি',
      'পাসপোর্ট সাইজ রঙিন ছবি ও স্বাক্ষর'
    ],
    officialPortalUrl: 'https://onlineservices.nsdl.com',
    authorizationRequirement: 'বিদ্যমান প্যান নম্বর থাকা বাধ্যতামূলক।',
    formSchema: [
      {
        name: 'panNumber',
        labelBn: 'বিদ্যমান প্যান কার্ড নম্বর (১০ অক্ষর)',
        labelEn: 'Existing 10-Character PAN Number',
        type: 'text',
        required: true,
        placeholderBn: 'যেমন: ABCDE1234F',
        placeholderEn: 'e.g. ABCDE1234F'
      },
      {
        name: 'correctionType',
        labelBn: 'কী সংশোধন করতে চান?',
        labelEn: 'Correction Type',
        type: 'select',
        required: true,
        options: [
          { value: 'name', labelBn: 'নাম সংশোধন', labelEn: 'Name Correction' },
          { value: 'father', labelBn: 'পিতার নাম সংশোধন', labelEn: "Father's Name" },
          { value: 'dob', labelBn: 'জন্মতারিখ সংশোধন', labelEn: 'Date of Birth' },
          { value: 'reprint', labelBn: 'শুধুমাত্র হারানো কার্ড পুনর্মুদ্রণ', labelEn: 'Reprint Only (No Change)' }
        ]
      },
      {
        name: 'correctDetails',
        labelBn: 'সঠিক বিবরণ',
        labelEn: 'Correct Details Required',
        type: 'textarea',
        required: true
      }
    ]
  },

  // --- Category C: Voter Services ---
  {
    id: 'voter-new-form6',
    categoryId: 'voter',
    categoryNameBn: 'ভোটার সেবা',
    categoryNameEn: 'Voter Services',
    titleBn: 'নতুন ভোটার তালিকাভুক্তি (ফর্ম ৬) সহায়তা',
    titleEn: 'New Voter Registration (Form 6) Assistance',
    descriptionBn: '১৮ বছর বয়স পূর্ণকারী ভারতীয় নাগরিকদের জন্য ভারতের নির্বাচন কমিশনের জাতীয় ভোটার সেবা পোর্টালে (ECI ECINET) নতুন আবেদনের সহায়তা।',
    descriptionEn: 'Assistance in filing Form 6 for registration of new electors on the Election Commission of India portal.',
    active: true,
    officialFee: 0,
    serviceCharge: 80,
    requiredDocuments: [
      'বয়সের প্রমাণপত্র (বার্থ সার্টিফিকেট/মাধ্যমিক অ্যাডমিট/আধার)',
      'ঠিকানার প্রমাণপত্র (বিদ্যুৎ বিল/পাসবুক/রেশন কার্ড)',
      'আবেদনকারীর ১ কপি রঙিন পাসপোর্ট ছবি',
      'পরিবারের যেকোনো সদস্যের ভোটার আইডি নম্বর (ঐচ্ছিক কিন্তু উপকারী)'
    ],
    officialPortalUrl: 'https://voters.eci.gov.in',
    authorizationRequirement: 'আবেদনকারীকে অবশ্যই ভারতীয় নাগরিক হতে হবে এবং আবেদন যোগ্যতার বয়স অর্জন করতে হবে।',
    formSchema: [
      {
        name: 'fullName',
        labelBn: 'আবেদনকারীর পুরো নাম',
        labelEn: 'Full Name of Applicant',
        type: 'text',
        required: true
      },
      {
        name: 'relationName',
        labelBn: 'পিতা/স্বামী/অভিভাবকের নাম',
        labelEn: "Father's / Husband's / Guardian's Name",
        type: 'text',
        required: true
      },
      {
        name: 'assemblyConstituency',
        labelBn: 'বিধানসভা কেন্দ্রের নাম/নম্বর',
        labelEn: 'Assembly Constituency (West Bengal)',
        type: 'text',
        required: true,
        placeholderBn: 'যেমন: বহরমপুর / রানাঘাট / কৃষ্ণনগর / বারাসাত ইত্যাদি',
        placeholderEn: 'e.g. Berhampore, Barasat, Ranaghat'
      },
      {
        name: 'dob',
        labelBn: 'জন্মতারিখ',
        labelEn: 'Date of Birth',
        type: 'date',
        required: true
      }
    ]
  },
  {
    id: 'voter-correction-form8',
    categoryId: 'voter',
    categoryNameBn: 'ভোটার সেবা',
    categoryNameEn: 'Voter Services',
    titleBn: 'ভোটার কার্ড সংশোধন ও স্থানান্তর (ফর্ম ৮) সহায়তা',
    titleEn: 'Voter Card Correction & Address Shifting (Form 8) Assistance',
    descriptionBn: 'ভোটার পরিচয়পত্রে ভুল নাম, ছবি, বয়স সংশোধন বা নতুন ঠিকানায় ভোটার এলাকা পরিবর্তনের আবেদন।',
    descriptionEn: 'Assistance for shifting of residence, correction of entries in electoral roll via Form 8.',
    active: true,
    officialFee: 0,
    serviceCharge: 80,
    requiredDocuments: [
      'বিদ্যমান ভোটার কার্ড (EPIC নম্বর)',
      'সংশোধনের স্বপক্ষে বৈধ নথি (আধার বা বার্থ সার্টিফিকেট বা বিদ্যুৎ বিল)'
    ],
    officialPortalUrl: 'https://voters.eci.gov.in',
    authorizationRequirement: 'সঠিক EPIC নম্বর থাকা আবশ্যক।',
    formSchema: [
      {
        name: 'epicNumber',
        labelBn: 'বিদ্যমান ভোটার কার্ডের EPIC নম্বর',
        labelEn: 'Existing EPIC Number',
        type: 'text',
        required: true,
        placeholderBn: 'যেমন: WBF1234567',
        placeholderEn: 'e.g. WBF1234567'
      },
      {
        name: 'correctionField',
        labelBn: 'সংশোধনের বিবরণ',
        labelEn: 'Correction Field',
        type: 'select',
        required: true,
        options: [
          { value: 'name', labelBn: 'নামের বানান সংশোধন', labelEn: 'Name Correction' },
          { value: 'address', labelBn: 'বাসস্থান স্থানান্তর / নতুন ঠিকানা', labelEn: 'Address Shifting' },
          { value: 'photo', labelBn: 'নতুন ছবি আপডেট', labelEn: 'Photograph' },
          { value: 'dob', labelBn: 'বয়স বা জন্মতারিখ', labelEn: 'Age / DOB' }
        ]
      },
      {
        name: 'correctValue',
        labelBn: 'সঠিক তথ্য লিখুন',
        labelEn: 'Enter Correct Information',
        type: 'textarea',
        required: true
      }
    ]
  },

  // --- Category D: Driving Licence Services ---
  {
    id: 'dl-learner-licence',
    categoryId: 'driving',
    categoryNameBn: 'ড্রাইভিং লাইসেন্স সেবা',
    categoryNameEn: 'Driving Licence Services',
    titleBn: 'লার্নার্স লাইসেন্স (LL) অনলাইন আবেদন সহায়তা',
    titleEn: "Learner's Licence (LL) Online Assistance",
    descriptionBn: 'পরিবহন (Sarathi Parivahan) পোর্টালে মোটরসাইকেল ও লাইট মোটর ভেহিকেলের নতুন লার্নার্স লাইসেন্স আবেদন এবং টেস্ট স্লট সহায়তা।',
    descriptionEn: "Filing and document assistance for Learner's Licence on the official Parivahan Sarathi portal for West Bengal RTOs.",
    active: true,
    officialFee: 240,
    serviceCharge: 150,
    requiredDocuments: [
      'বয়স ও ঠিকানার প্রমাণ (আধার কার্ড)',
      'শিক্ষাগত যোগ্যতার সার্টিফিকেট (ন্যূনতম অষ্টম শ্রেণী পাস বা মাধ্যমিক)',
      'পাসপোর্ট সাইজ ছবি ও স্বাক্ষর',
      'মেডিকেল ডিক্লারেশন ফর্ম ১'
    ],
    officialPortalUrl: 'https://sarathi.parivahan.gov.in',
    authorizationRequirement: 'আধার ভিত্তিক অনলাইন টেস্ট অথবা স্থানীয় RTO টেস্ট স্লট নির্দেশিকা।',
    formSchema: [
      {
        name: 'applicantName',
        labelBn: 'আবেদনকারীর পুরো নাম',
        labelEn: 'Applicant Full Name',
        type: 'text',
        required: true
      },
      {
        name: 'rtoOffice',
        labelBn: 'আপনার জেলার RTO অফিস (পশ্চিমবঙ্গ)',
        labelEn: 'Local RTO Office (WB)',
        type: 'text',
        required: true,
        placeholderBn: 'যেমন: Berhampore (WB-57) / Barasat (WB-25)',
        placeholderEn: 'e.g. Berhampore, Barasat, Siliguri, Alipore'
      },
      {
        name: 'vehicleClass',
        labelBn: 'গাড়ির ক্যাটাগরি',
        labelEn: 'Vehicle Class',
        type: 'select',
        required: true,
        options: [
          { value: 'mcwg', labelBn: 'মোটরসাইকেল (MCWG - গিয়ারযুক্ত)', labelEn: 'Motorcycle with Gear (MCWG)' },
          { value: 'lmv', labelBn: 'হালকা চারচাকা মোটরগাড়ি (LMV)', labelEn: 'Light Motor Vehicle (LMV)' },
          { value: 'both', labelBn: 'মোটরসাইকেল এবং চারচাকা উভয়ই', labelEn: 'Both MCWG + LMV' }
        ]
      },
      {
        name: 'bloodGroup',
        labelBn: 'রক্তের গ্রুপ (Blood Group)',
        labelEn: 'Blood Group',
        type: 'select',
        required: true,
        options: [
          { value: 'A+', labelBn: 'A+', labelEn: 'A+' },
          { value: 'A-', labelBn: 'A-', labelEn: 'A-' },
          { value: 'B+', labelBn: 'B+', labelEn: 'B+' },
          { value: 'B-', labelBn: 'B-', labelEn: 'B-' },
          { value: 'O+', labelBn: 'O+', labelEn: 'O+' },
          { value: 'O-', labelBn: 'O-', labelEn: 'O-' },
          { value: 'AB+', labelBn: 'AB+', labelEn: 'AB+' },
          { value: 'AB-', labelBn: 'AB-', labelEn: 'AB-' }
        ]
      }
    ]
  },
  {
    id: 'dl-renewal-duplicate',
    categoryId: 'driving',
    categoryNameBn: 'ড্রাইভিং লাইসেন্স সেবা',
    categoryNameEn: 'Driving Licence Services',
    titleBn: 'ড্রাইভিং লাইসেন্স নবায়ন ও প্রতিলিপি সহায়তা',
    titleEn: 'Driving Licence Renewal & Duplicate Assistance',
    descriptionBn: 'মেয়াদোত্তীর্ণ ড্রাইভিং লাইসেন্স নবায়ন বা হারিয়ে যাওয়া লাইসেন্সের ডুপ্লিকেট কপি পাওয়ার আবেদন সহায়তা।',
    descriptionEn: 'Renewal of expired DL or duplicate issuance assistance via Parivahan portal.',
    active: true,
    officialFee: 200,
    serviceCharge: 150,
    requiredDocuments: [
      'বর্তমান ড্রাইভিং লাইসেন্স নম্বর ও কপি',
      'আধার কার্ড',
      'ডুপ্লিকেট হলে জিডি (General Diary) কপি'
    ],
    officialPortalUrl: 'https://sarathi.parivahan.gov.in',
    authorizationRequirement: 'বৈধ পূর্বতন লাইসেন্স রেকর্ড সারথী পোর্টালে থাকতে হবে।',
    formSchema: [
      {
        name: 'dlNumber',
        labelBn: 'লাইসেন্স নম্বর (DL Number)',
        labelEn: 'Driving Licence Number',
        type: 'text',
        required: true,
        placeholderBn: 'যেমন: WB57 20180012345',
        placeholderEn: 'e.g. WB57 20180012345'
      },
      {
        name: 'requestType',
        labelBn: 'আবেদনের ধরন',
        labelEn: 'Service Requested',
        type: 'select',
        required: true,
        options: [
          { value: 'renewal', labelBn: 'লাইসেন্স নবায়ন (Renewal)', labelEn: 'Renewal' },
          { value: 'duplicate', labelBn: 'হারিয়ে যাওয়া লাইসেন্স (Duplicate)', labelEn: 'Duplicate' },
          { value: 'address_change', labelBn: 'ঠিকানা পরিবর্তন', labelEn: 'Address Change' }
        ]
      }
    ]
  },

  // --- Category E: EPFO / PF Services ---
  {
    id: 'epfo-uan-activation-claim',
    categoryId: 'epfo',
    categoryNameBn: 'ইপিএফও / পিএফ সেবা',
    categoryNameEn: 'EPFO / PF Services',
    titleBn: 'ইউএএন (UAN) অ্যাক্টিভেশন ও পিএফ টাকা তোলার আবেদন (Claim)',
    titleEn: 'UAN Activation & PF Withdrawal Claim Assistance',
    descriptionBn: 'কর্মচারী ভবিষ্যনিধি সংস্থা (EPFO) এর মেম্বার পোর্টালে UAN চালু, ফর্ম ৩১ (অগ্রিম), ফর্ম ১৯ (চূড়ান্ত) বা ১০সি (পেনশন) আবেদন সহায়তা।',
    descriptionEn: 'Assistance for online UAN member activation, e-KYC bank seeding, and PF claim forms (Form 19/10C/31).',
    active: true,
    officialFee: 0,
    serviceCharge: 150,
    requiredDocuments: [
      '১২ সংখ্যার UAN নম্বর',
      'আধার লিঙ্কযুক্ত মোবাইল নম্বর (ওটিপির জন্য)',
      'ব্যাঙ্ক পাসবুকের ছবি বা ক্যান্সেল চেক (যাতে নাম ও অ্যাকাউন্ট স্পষ্ট থাকে)',
      'প্যান কার্ডের কপি (প্রযোজ্য ক্ষেত্রে)'
    ],
    officialPortalUrl: 'https://unifiedportal-mem.epfindia.gov.in',
    authorizationRequirement: 'পিএফ অ্যাকাউন্টে আধার এবং ব্যাঙ্ক অ্যাকাউন্ট ভেরিফাইড (KYC) থাকতে হবে। পাসওয়ার্ড গ্রাহকের সম্মতিতে এককালীন ব্যবহার্য।',
    formSchema: [
      {
        name: 'uanNumber',
        labelBn: '১২ সংখ্যার UAN নম্বর',
        labelEn: '12-Digit UAN Number',
        type: 'text',
        required: true,
        placeholderBn: 'যেমন: 101234567890',
        placeholderEn: 'e.g. 101234567890'
      },
      {
        name: 'claimType',
        labelBn: 'আবেদনের ধরন',
        labelEn: 'Claim Type',
        type: 'select',
        required: true,
        options: [
          { value: 'advance_form31', labelBn: 'পিএফ অগ্রিম টাকা তোলা (ফর্ম ৩১)', labelEn: 'PF Advance (Form 31)' },
          { value: 'final_form19', labelBn: 'চাকরি ছাড়ার পর সম্পূর্ণ পিএফ তোলা (ফর্ম ১৯)', labelEn: 'Full PF Withdrawal (Form 19)' },
          { value: 'pension_10c', labelBn: 'পেনশন উইথড্রয়াল বেনিফিট (ফর্ম ১০সি)', labelEn: 'Pension Claim (Form 10C)' },
          { value: 'kyc_update', labelBn: 'ব্যাঙ্ক ও আধার লিঙ্ক / কেওয়াইসি আপডেট', labelEn: 'KYC & Bank Update' }
        ]
      },
      {
        name: 'bankNameAccount',
        labelBn: 'ব্যাঙ্কের নাম ও অ্যাকাউন্ট নম্বর',
        labelEn: 'Bank Name & Account Number',
        type: 'text',
        required: true
      }
    ]
  },

  // --- Category F: CSC and Digital Services ---
  {
    id: 'csc-exam-job-application',
    categoryId: 'csc',
    categoryNameBn: 'সিএসসি ও ডিজিটাল সেবা',
    categoryNameEn: 'CSC & Digital Services',
    titleBn: 'অনলাইন সরকারি চাকরি ও পরীক্ষার ফর্ম পূরণ সহায়তা',
    titleEn: 'Online Job Application & Competitive Exam Form Assistance',
    descriptionBn: 'ডব্লিউবিসিএস, প্রাইমারি টেট, রেল, এসএসসি বা রাজ্য সরকারের বিভিন্ন পরীক্ষার ফর্ম নির্ভুলভাবে পূরণ ও প্রবেশপত্র ডাউনলোডে সাহায্য।',
    descriptionEn: 'Assistance in filling online applications, photo/signature resizing, and fee payments for state & central exams.',
    active: true,
    officialFee: 150,
    serviceCharge: 100,
    requiredDocuments: [
      'শিক্ষাগত যোগ্যতার মার্কশিট ও সার্টিফিকেট',
      'পাসপোর্ট সাইজ ছবি ও স্বাক্ষর',
      'জাতিগত শংসাপত্র (SC/ST/OBC প্রযোজ্য হলে)',
      'আধার কার্ড'
    ],
    officialPortalUrl: 'https://wb.gov.in',
    authorizationRequirement: 'বিজ্ঞপ্তির নির্দিষ্ট শর্তাবলী এবং যোগ্যতার মানদণ্ড আবেদনকারীকে নিশ্চিত করতে হবে।',
    formSchema: [
      {
        name: 'examName',
        labelBn: 'যে চাকরির/পরীক্ষার জন্য আবেদন করছেন',
        labelEn: 'Post or Examination Name',
        type: 'text',
        required: true,
        placeholderBn: 'যেমন: WBPSC Food SI / SSC GD / WB Police',
        placeholderEn: 'e.g. WB Police Constable, WBPSC'
      },
      {
        name: 'highestQualification',
        labelBn: 'সর্বোচ্চ শিক্ষাগত যোগ্যতা',
        labelEn: 'Highest Educational Qualification',
        type: 'text',
        required: true
      },
      {
        name: 'casteCategory',
        labelBn: 'ক্যাটাগরি',
        labelEn: 'Category',
        type: 'select',
        required: true,
        options: [
          { value: 'general', labelBn: 'সাধারণ (General / UR)', labelEn: 'General / UR' },
          { value: 'obc_a', labelBn: 'ওবিসি-এ (OBC-A)', labelEn: 'OBC-A' },
          { value: 'obc_b', labelBn: 'ওবিসি-বি (OBC-B)', labelEn: 'OBC-B' },
          { value: 'sc', labelBn: 'তফসিলি জাতি (SC)', labelEn: 'SC' },
          { value: 'st', labelBn: 'তফসিলি উপজাতি (ST)', labelEn: 'ST' },
          { value: 'ews', labelBn: 'ইডব্লিউএস (EWS)', labelEn: 'EWS' }
        ]
      }
    ]
  },
  {
    id: 'csc-electricity-bill-challan',
    categoryId: 'csc',
    categoryNameBn: 'সিএসসি ও ডিজিটাল সেবা',
    categoryNameEn: 'CSC & Digital Services',
    titleBn: 'বিদ্যুৎ বিল (WBSEDCL) ও সরকারি ই-চালান পেমেন্ট',
    titleEn: 'WBSEDCL Electricity Bill & Govt GRIPS e-Challan Payment',
    descriptionBn: 'পশ্চিমবঙ্গ রাজ্য বিদ্যুৎ পর্ষদের বিল পেমেন্ট ও সরকারি রাজস্ব বা ফি জমাদানের GRIPS ই-চালান তৈরি ও রসিদ প্রদান।',
    descriptionEn: 'Assistance for online utility bill payments and GRIPS portal e-challan generation with official receipt.',
    active: true,
    officialFee: 0,
    serviceCharge: 30,
    requiredDocuments: [
      'বিদ্যুৎ বিলের কপি বা কনজিউমার আইডি',
      'প্রযোজ্য ক্ষেত্রে চালান রেফারেন্স'
    ],
    officialPortalUrl: 'https://www.wbsedcl.in',
    authorizationRequirement: 'বিল জমা সম্পন্ন হওয়ার পর তাৎক্ষণিক অফিসিয়াল রসিদ সরবরাহ করা হয়।',
    formSchema: [
      {
        name: 'consumerId',
        labelBn: 'WBSEDCL ৯ সংখ্যার কনজিউমার আইডি',
        labelEn: '9-Digit Consumer ID',
        type: 'text',
        required: true,
        placeholderBn: 'যেমন: 102345678',
        placeholderEn: 'e.g. 102345678'
      },
      {
        name: 'billMonthOrType',
        labelBn: 'বিলের মাস বা পেমেন্টের ধরন',
        labelEn: 'Bill Month / Payment Type',
        type: 'text',
        required: true
      }
    ]
  },

  // --- Category G: Certificates (West Bengal e-District) ---
  {
    id: 'cert-income-certificate',
    categoryId: 'certificates',
    categoryNameBn: 'শংসাপত্র / সার্টিফিকেট',
    categoryNameEn: 'Certificates (e-District)',
    titleBn: 'ইনকাম সার্টিফিকেট (আয় শংসাপত্র) আবেদন সহায়তা',
    titleEn: 'Income Certificate (e-District WB) Assistance',
    descriptionBn: 'পশ্চিমবঙ্গ ই-ডিস্ট্রিক্ট (e-District 2.0) পোর্টালে মহকুমা শাসক (SDO) বা বিডিও (BDO) অনুমোদিত ডিজিটাল ইনকাম সার্টিফিকেটের আবেদন সহায়তা।',
    descriptionEn: 'Assistance for online application of SDO/BDO digitally signed Income Certificate on West Bengal e-District portal.',
    active: true,
    officialFee: 0,
    serviceCharge: 100,
    requiredDocuments: [
      'আধার কার্ড বা ভোটার কার্ড',
      'পঞ্চায়েত প্রধান বা পৌরসভার কাউন্সিলরের আয়ের শংসাপত্র',
      'বেতন শংসাপত্র / জমির রেকর্ড বা ব্যবসার হিসাব (প্রযোজ্য ক্ষেত্রে)',
      '১ কপি পাসপোর্ট সাইজ রঙিন ছবি'
    ],
    officialPortalUrl: 'https://edistrict.wb.gov.in',
    authorizationRequirement: 'স্থানীয় কর্তৃপক্ষের প্রাথমিক ইনকাম স্লিপ বা সার্টিফিকেট জমা দেওয়া বাধ্যতামূলক।',
    formSchema: [
      {
        name: 'applicantName',
        labelBn: 'আবেদনকারীর পুরো নাম',
        labelEn: 'Applicant Full Name',
        type: 'text',
        required: true
      },
      {
        name: 'annualIncome',
        labelBn: 'বাৎসরিক মোট পারিবারিক আয় (টাকায়)',
        labelEn: 'Annual Family Income (in INR)',
        type: 'text',
        required: true,
        placeholderBn: 'যেমন: ৬০,০০০ টাকা',
        placeholderEn: 'e.g. 60000'
      },
      {
        name: 'purposeOfCertificate',
        labelBn: 'সার্টিফিকেট গ্রহণের উদ্দেশ্য',
        labelEn: 'Purpose of Certificate',
        type: 'select',
        required: true,
        options: [
          { value: 'scholarship', labelBn: 'স্কলারশিপ / বৃত্তির জন্য (ঐক্যশ্রী/স্বামী বিবেকানন্দ)', labelEn: 'Scholarship (Oasis / SVMCM / Aikyashree)' },
          { value: 'admission', labelBn: 'কলেজ বা স্কুলে ভর্তির জন্য', labelEn: 'School / College Admission' },
          { value: 'gov_scheme', labelBn: 'সরকারি প্রকল্পের সুবিধার জন্য', labelEn: 'Government Scheme Benefit' },
          { value: 'other', labelBn: 'অন্যান্য প্রয়োজনে', labelEn: 'Other' }
        ]
      }
    ]
  },
  {
    id: 'cert-domicile-residence',
    categoryId: 'certificates',
    categoryNameBn: 'শংসাপত্র / সার্টিফিকেট',
    categoryNameEn: 'Certificates (e-District)',
    titleBn: 'আবাসিক / ডোমিসাইল সার্টিফিকেট সহায়তা',
    titleEn: 'Residential / Domicile Certificate Assistance',
    descriptionBn: 'পশ্চিমবঙ্গে স্থায়ী বসবাসের সরকারি ডিজিটাল সার্টিফিকেটের জন্য ই-ডিস্ট্রিক্ট পোর্টালে নির্ভুল আবেদন তৈরি।',
    descriptionEn: 'Assistance in filing Residential Certificate application on West Bengal e-District portal.',
    active: true,
    officialFee: 0,
    serviceCharge: 100,
    requiredDocuments: [
      'ভোটার কার্ড বা আধার কার্ড',
      'প্রধান বা ওয়ার্ড কাউন্সিলরের সার্টিফিকেট',
      'জমির দলিল/পর্চা বা বিগত কয়েক বছরের বসবাস সংক্রান্ত প্রমাণপত্র'
    ],
    officialPortalUrl: 'https://edistrict.wb.gov.in',
    authorizationRequirement: 'পশ্চিমবঙ্গে ন্যূনতম ১০-১৫ বছর বসবাসের স্বপক্ষে প্রমাণ আবশ্যক।',
    formSchema: [
      {
        name: 'applicantName',
        labelBn: 'আবেদনকারীর পুরো নাম',
        labelEn: 'Applicant Full Name',
        type: 'text',
        required: true
      },
      {
        name: 'yearsOfResidence',
        labelBn: 'বর্তমান ঠিকানায় কত বছর বসবাস করছেন?',
        labelEn: 'Years Living at Current Address',
        type: 'text',
        required: true,
        placeholderBn: 'যেমন: ২৫ বছর',
        placeholderEn: 'e.g. 25 years'
      }
    ]
  },

  // --- Category H: Other Services ---
  {
    id: 'ration-card-assistance',
    categoryId: 'other',
    categoryNameBn: 'অন্যান্য সরকারি স্কিম',
    categoryNameEn: 'Other Services & Schemes',
    titleBn: 'ডিজিটাল রেশন কার্ড আবেদন ও সংশোধন সহায়তা',
    titleEn: 'West Bengal Digital Ration Card Assistance',
    descriptionBn: 'পশ্চিমবঙ্গ খাদ্য ও সরবরাহ দফতরে নতুন রেশন কার্ড (ফর্ম ৪), নাম/ঠিকানা সংশোধন (ফর্ম ৫) বা পরিবার প্রধান স্থানান্তর সহায়তা।',
    descriptionEn: 'Assistance with online filing on West Bengal Food & Supplies Department portal.',
    active: true,
    officialFee: 0,
    serviceCharge: 80,
    requiredDocuments: [
      'পরিবারের আধার কার্ড কপি',
      'বিদ্যমান রেশন কার্ড নম্বর (যদি থাকে)',
      'পরিবার প্রধানের আধার লিঙ্ক মোবাইল নম্বর'
    ],
    officialPortalUrl: 'https://food.wb.gov.in',
    authorizationRequirement: 'মোবাইল নম্বরে প্রেরিত ওটিপির মাধ্যমে অনলাইন আবেদন জমা করা হয়।',
    formSchema: [
      {
        name: 'headOfFamily',
        labelBn: 'পরিবার প্রধানের নাম',
        labelEn: 'Head of Family Name',
        type: 'text',
        required: true
      },
      {
        name: 'rationCardType',
        labelBn: 'রেশন কার্ড ক্যাটাগরি (যদি থাকে)',
        labelEn: 'Ration Card Category',
        type: 'select',
        required: true,
        options: [
          { value: 'aay', labelBn: 'অন্ত্যোদয় অন্ন যোজনা (AAY)', labelEn: 'AAY' },
          { value: 'sphh', labelBn: 'বিশেষ অগ্রাধিকার (SPHH)', labelEn: 'SPHH' },
          { value: 'phh', labelBn: 'অগ্রাধিকার প্রাপ্ত (PHH)', labelEn: 'PHH' },
          { value: 'rksy1', labelBn: 'আরকেএসওয়াই ১ (RKSY-I)', labelEn: 'RKSY-I' },
          { value: 'rksy2', labelBn: 'আরকেএসওয়াই ২ (RKSY-II)', labelEn: 'RKSY-II' },
          { value: 'new', labelBn: 'সম্পূর্ণ নতুন আবেদন (কোনো কার্ড নেই)', labelEn: 'No existing card' }
        ]
      }
    ]
  },
  {
    id: 'passport-seva-assistance',
    categoryId: 'other',
    categoryNameBn: 'অন্যান্য সরকারি স্কিম',
    categoryNameEn: 'Other Services & Schemes',
    titleBn: 'পাসপোর্ট সেবা অনলাইন আবেদন ও অ্যাপয়েন্টমেন্ট বুকিং',
    titleEn: 'Passport Seva Online Application & Appointment Assistance',
    descriptionBn: 'পাসপোর্ট সেবা কেন্দ্র (PSK) বা পোস্ট অফিস পাসপোর্ট সেবা কেন্দ্রের (POPSK) জন্য নতুন বা পুনর্নবায়ন অনলাইন আবেদন সহায়তা।',
    descriptionEn: 'Assistance with Passport Seva portal application filing, fee payment, and appointment slot selection.',
    active: true,
    officialFee: 1500,
    serviceCharge: 300,
    requiredDocuments: [
      'আধার কার্ড (বাধ্যতামূলক)',
      'প্যান কার্ড বা ভোটার কার্ড',
      'জন্মতারিখের প্রমাণ (বার্থ সার্টিফিকেট বা মাধ্যমিক অ্যাডমিট)',
      'শিক্ষাগত যোগ্যতার সার্টিফিকেট (ECNR স্ট্যাটাসের জন্য)'
    ],
    officialPortalUrl: 'https://passportindia.gov.in',
    authorizationRequirement: 'আবেদনকারীকে নির্দিষ্ট তারিখে পাসপোর্ট সেবা কেন্দ্রে বায়োমেট্রিক ও ভেরিফিকেশনের জন্য উপস্থিত হতে হবে।',
    formSchema: [
      {
        name: 'applicantName',
        labelBn: 'আবেদনকারীর নাম (পাসপোর্ট অনুযায়ী)',
        labelEn: 'Applicant Name',
        type: 'text',
        required: true
      },
      {
        name: 'preferredPsk',
        labelBn: 'পছন্দের পাসপোর্ট অফিস (POPSK / PSK)',
        labelEn: 'Preferred Passport Centre',
        type: 'text',
        required: true,
        placeholderBn: 'যেমন: Berhampore POPSK, Kolkata PSK, Malda',
        placeholderEn: 'e.g. Berhampore POPSK, Kolkata PSK'
      }
    ]
  }
];

export const SERVICE_CATEGORIES = [
  { id: 'all', nameBn: 'সমস্ত সেবা', nameEn: 'All Services', icon: 'LayoutGrid' },
  { id: 'aadhaar', nameBn: 'আধার সেবা', nameEn: 'Aadhaar Services', icon: 'Fingerprint' },
  { id: 'pan', nameBn: 'প্যান কার্ড', nameEn: 'PAN Card', icon: 'CreditCard' },
  { id: 'voter', nameBn: 'ভোটার সেবা', nameEn: 'Voter Services', icon: 'Vote' },
  { id: 'driving', nameBn: 'ড্রাইভিং লাইসেন্স', nameEn: 'Driving Licence', icon: 'Car' },
  { id: 'epfo', nameBn: 'ইপিএফও / পিএফ', nameEn: 'EPFO / PF', icon: 'PiggyBank' },
  { id: 'csc', nameBn: 'সিএসসি ও ডিজিটাল', nameEn: 'CSC & Digital', icon: 'Globe' },
  { id: 'certificates', nameBn: 'সার্টিফিকেট সেবা', nameEn: 'Certificates', icon: 'FileBadge' },
  { id: 'other', nameBn: 'অন্যান্য স্কিম', nameEn: 'Other Schemes', icon: 'Sparkles' },
];

export const DEFAULT_CENTRE_CONFIG = {
  centreNameBn: 'আফরান অনলাইন সেন্টার',
  centreNameEn: 'AFRAN ONLINE CENTRE',
  centrePhone: '+91 7074626784',
  centreWhatsApp: '+91 7074626784',
  centreEmail: 'afranonlinecentre@gmail.com',
  centreAddressBn: 'উত্তর মহাদেবনগর, মামরেজপুর ব্রিজ, ফারাক্কা, পশ্চিমবঙ্গ - ৭৪২২০২, ভারত',
  centreAddressEn: 'UTTAR MAHADEBNAGAR, MAMREJPUR BRIDGE, FARAKKA, WEST BENGAL - 742202, INDIA',
  operatingHoursBn: 'সোম - শনি: সকাল ৯:০০ টা - রাত ৮:৩০ টা (রবিবার জরুরি আবেদন সাপেক্ষে)',
  operatingHoursEn: 'Mon - Sat: 9:00 AM - 8:30 PM (Sunday by appointment)',
  upiId: 'afranonline@upi',
  ownerName: 'মালিক / পরিচালক (AFRAN Owner)',
  noticeBn: 'জরুরি বিজ্ঞপ্তি: আধার, ভোটার ও ডিজিটাল আবেদন সেবা সক্রিয় রয়েছে। সেন্টারে আসার আগে প্রয়োজনীয় মূল নথি সঙ্গে আনুন।',
  noticeEn: 'Notice: Aadhaar, Voter & Digital application services operational at Farakka branch. Please bring original supporting documents.'
};
