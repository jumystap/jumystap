<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $name }} - Резюме</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
            line-height: 1.5;
            color: #333;
            background-color: #fff;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }

        /* Header Section */
        .header {
            background: #3B82F6;
            color: white;
            padding: 30px;
            margin-bottom: 30px;
            border-radius: 10px;
            position: relative;
            overflow: hidden;
        }

        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }

        .header-content {
            position: relative;
            z-index: 1;
        }

        .logo {
            width: 60px;
            height: 60px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            float: right;
            margin-left: 20px;
            font-size: 24px;
            font-weight: bold;
        }

        .main-title {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 5px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .subtitle {
            font-size: 18px;
            opacity: 0.9;
            margin-bottom: 20px;
        }

        /* Fixed contact-info for DomPDF compatibility */
        .contact-info {
            margin-top: 15px;
            overflow: hidden; /* Clearfix */
        }

        .contact-item {
            display: inline-block;
            background: rgba(255, 255, 255, 0.1);
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 11px;
            margin-right: 15px;
            margin-bottom: 8px;
            vertical-align: top;
        }

        .contact-item span {
            display: inline-block;
            vertical-align: middle;
        }

        .contact-item span:first-child {
            margin-right: 8px;
        }

        /* Section Styles */
        .section {
            margin-bottom: 30px;
        }

        .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #3B82F6;
            margin-bottom: 15px;
            padding-bottom: 5px;
            border-bottom: 2px solid #3B82F6;
            position: relative;
        }

        /* Experience Section */
        .experience-item {
            margin-bottom: 25px;
            padding: 20px;
            background: #f8f9ff;
            border-radius: 8px;
            border-left: 4px solid #3B82F6;
            position: relative;
        }

        .job-title {
            font-size: 16px;
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
        }

        .company-info {
            font-size: 14px;
            color: #666;
            margin-bottom: 10px;
        }

        .company-name {
            font-weight: bold;
            color: #3B82F6;
        }

        .period {
            background: #3B82F6;
            color: white;
            padding: 3px 6px 6px;
            border-radius: 15px;
            font-size: 10px;
            font-weight: bold;
            display: inline-block;
            margin-bottom: 10px;
        }

        .responsibilities {
            list-style: none;
            padding: 0;
        }

        .responsibilities li {
            margin-bottom: 8px;
            padding-left: 20px;
            position: relative;
            font-size: 12px;
            line-height: 1.4;
        }

        .responsibilities li::before {
            content: '▸';
            position: absolute;
            left: 0;
            color: #3B82F6;
            font-weight: bold;
        }

        /* Education Section */
        .education-item {
            background: #fff;
            border: 1px solid #e0e6ed;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 15px;
        }

        .degree {
            font-size: 14px;
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
        }

        .institution {
            font-size: 13px;
            color: #3B82F6;
            font-weight: bold;
            margin-bottom: 10px;
        }

        /* Skills Section */
        .skills-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }

        .skill-item {
            background: linear-gradient(135deg, #f5f7ff 0%, #e8f2ff 100%);
            padding: 5px 10px 0 10px;
            border-radius: 50px;
            border: 2px solid #3B82F6;
            font-size: 11px;
            text-align: center;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 60px;
            height: 30px;
        }

        /* Projects Section */
        .project-item {
            background: #fff;
            border: 1px solid #e0e6ed;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }

        .project-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }

        .project-name {
            font-size: 15px;
            font-weight: bold;
            color: #333;
            float: left;
            width: 70%;
        }

        .project-year {
            background: #3B82F6;
            color: white;
            padding: 3px 8px 6px;
            border-radius: 15px;
            font-size: 11px;
            font-weight: bold;
            float: right;
            text-align: center;
        }

        .project-details {
            list-style: none;
            padding: 0;
            margin-top: 10px;
            clear: both;
        }

        .project-details li {
            margin-bottom: 8px;
            padding-left: 20px;
            position: relative;
            font-size: 12px;
            line-height: 1.4;
        }

        .project-details li::before {
            content: '●';
            position: absolute;
            left: 0;
            color: #3B82F6;
        }

        /* Utility Classes */
        .clearfix::after {
            content: "";
            display: table;
            clear: both;
        }

        .text-center {
            text-align: center;
        }

        .mb-10 {
            margin-bottom: 10px;
        }

        .mb-15 {
            margin-bottom: 15px;
        }

        .mb-20 {
            margin-bottom: 20px;
        }

        /* Print Styles */
        @media print {
            body {
                font-size: 11px;
            }

            .container {
                padding: 10px;
            }

            .section {
                page-break-inside: avoid;
                margin-bottom: 20px;
            }

            .experience-item,
            .project-item {
                page-break-inside: avoid;
            }
        }

        /* Responsive adjustments for PDF */
        @page {
            margin: 15mm;
        }
    </style>
</head>
<body>
<div class="container">
    <!-- Header Section -->
    <header class="header clearfix">
        <div class="header-content">
            <h1 class="main-title">{{ $name }}</h1>
            <div class="contact-info">
                <div class="contact-item">
                    <span>{{ $info }}</span>
                </div>
                <div class="contact-item">
                    <span>{{ $address }}</span>
                </div>
                <div class="contact-item">
                    <span>{{ $phone }}</span>
                </div>
                <div class="contact-item">
                    <span>{{ $email }}</span>
                </div>
            </div>
        </div>
    </header>

    <section class="section">
        <div class="project-item">
            <div class="project-header">
                <h3 class="project-name">{{ $position }}</h3>
                @if($salary)
                    <span class="project-year">{{ $salary }}</span>
                @endif
            </div>
            <ul class="project-details">
                <li>Занятость: {{ $employment_type }}</li>
                <li>График работы: {{ $work_schedule }}</li>
            </ul>
        </div>
    </section>

    <!-- Experience Section -->
    @if(count($experience))
        <section class="section">
            <h2 class="section-title">Опыт работы</h2>
            @foreach($experience as $job)
                <div class="experience-item">
                    <h3 class="job-title">{{ $job['title'] }}</h3>
                    <div class="company-info">
                        <span class="company-name">{{ $job['company'] }}</span>
                    </div>
                    <div class="period">{{ $job['period'] }}</div>
                    <ul class="responsibilities">
                        <li>{{ $job['responsibilities'] }}</li>
                    </ul>
                </div>
            @endforeach
        </section>
    @endif

    <!-- Education Section -->
    @if(count($education))
        <section class="section">
            <h2 class="section-title">Образование: {{ $education['education_level'] }}</h2>
            <div class="education-item">
                <h3 class="degree">{{ $education['degree'] }}</h3>
                <div class="institution">{{ $education['institution'] }} <div class="period" style="float:right;">{{ $education['period'] }}</div></div>
                @if(isset($languages))
                    <div class="mb-10">
                        <strong>Языки:</strong> {{ $languages }}.
                    </div>
                @endif
            </div>
        </section>
    @endif

    <!-- Skills Section -->
    @if(count($skills))
        <section class="section">
            <h2 class="section-title">Навыки</h2>
            <div class="skills-grid">
                @foreach($skills as $skill)
                    <div class="skill-item">
                        {{ $skill }}
                    </div>
                @endforeach
            </div>
        </section>
    @endif

    <section class="section">
        <h2 class="section-title">Разрешения и дополнительная информация</h2>
        <div class="project-item">
            <ul class="project-details">
                @if($ip_status)
                    <li>Наличие ИП: {{ $ip_status }}.</li>
                @endif
                @if($has_car)
                    <li>Наличие автомобиля: {{ $has_car }}.</li>
                @endif
                @if($driving_license_title)
                    <li>Наличие автомобильных прав: {{ $driving_license_title }}.</li>
                @endif
                @if($about)
                    <li>О себе: {{ $about }}</li>
                @endif
            </ul>
        </div>
    </section>
</div>
</body>
</html>
