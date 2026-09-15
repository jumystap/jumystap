<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="UTF-8">
    <title>{{ $name }} — {{ __('messages.resume.pdf.section_experience') }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        /* DomPDF ignores @page margins entirely in this setup, so ALL page
           insets are done with padding on .page below. @page keeps a bottom
           reserve so flowing content never runs under the canvas footer. */
        @page { margin: 0 0 56px 0; }

        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
            color: #374151;
            background: #fff;
        }

        .page { padding: 44px 56px 40px 56px; }

        /* Fixed chrome repeated on every page */
        .topbar {
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 6px;
            background: #2563EB;
        }

        /* Header */
        .head { width: 100%; border-collapse: collapse; }
        .head td { vertical-align: top; }
        .head-photo { width: 96px; padding-right: 18px; }
        .photo-box {
            width: 88px; height: 108px;
            overflow: hidden;
            background: #F3F4F6;
        }
        .photo-box img { width: 88px; }
        .head-logo { width: 150px; text-align: right; }
        .logo-img { width: 130px; }

        .name { font-size: 29px; font-weight: bold; color: #111827; line-height: 1.12; }
        .position { font-size: 16.5px; color: #2563EB; margin-top: 7px; }
        .head-params { font-size: 12px; color: #6B7280; margin-top: 7px; }
        .head-meta { margin-top: 16px; }
        .meta { font-size: 12px; color: #6B7280; margin-top: 5px; }
        .meta:first-child { margin-top: 0; }

        .head-divider { border-bottom: 1px solid #E5E7EB; margin-top: 24px; }

        /* Sections */
        .section { margin-top: 36px; }
        .sec { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .sec-num {
            width: 1%; white-space: nowrap; vertical-align: top;
            color: #2563EB; font-size: 11px; font-weight: bold;
            line-height: 1.3;
            padding-right: 12px;
        }
        .sec-title {
            width: 1%; white-space: nowrap; vertical-align: middle;
            color: #111827; font-size: 15px; font-weight: bold;
            letter-spacing: 0.3px; line-height: 1;
            padding-right: 16px;
        }
        .sec-rule { border-bottom: 1px solid #E5E7EB; }

        /* Items */
        .item { margin-bottom: 20px; page-break-inside: avoid; }
        .item-title { font-size: 14px; font-weight: bold; color: #111827; }
        .item-sub { font-size: 12px; color: #374151; margin-top: 4px; }
        .item-period { font-size: 11.5px; color: #6B7280; margin-top: 5px; }
        .item-desc { font-size: 11.5px; color: #6B7280; margin-top: 7px; line-height: 1.6; }
        .add-about { margin-bottom: 6px; }

        /* Skills */
        .skills { margin: 4px 0 0 0; padding: 0 0 0 20px; }
        .skills li { font-size: 12px; color: #374151; margin-bottom: 9px; line-height: 1.5; }
    </style>
</head>
<body>
@php
    $sectionHead = function ($num, $title) {
        $nn = str_pad((string) $num, 2, '0', STR_PAD_LEFT);
        return '<table class="sec"><tr>'
            . '<td class="sec-num">' . $nn . '</td>'
            . '<td class="sec-title">' . e(mb_strtoupper($title)) . '</td>'
            . '<td class="sec-rule"></td>'
            . '</tr></table>';
    };
    $n = 0;
@endphp

<div class="topbar"></div>

{{-- Footer (jumystap.kz + page numbers) is drawn on every page via the DomPDF
     canvas in UserResumeController::download(), since counter(pages) is
     unreliable in this DomPDF version. --}}

<div class="page">
{{-- Header --}}
<table class="head">
    <tr>
        @if(!empty($photo))
            <td class="head-photo"><div class="photo-box"><img src="{{ $photo }}" alt=""></div></td>
        @endif
        <td class="head-main">
            <div class="name">{{ $name }}</div>
            @if(!empty($position))
                <div class="position">{{ $position }}</div>
            @endif
            @php $jobParams = array_values(array_filter([$employment_type ?? '', $work_schedule ?? '', $salary ?? ''])); @endphp
            @if(count($jobParams))
                <div class="head-params">{{ implode(' · ', $jobParams) }}</div>
            @endif
            @php
                $ageBirth = '';
                if ($age !== '' && $age !== null) {
                    $ageBirth = $age . ' ' . trans_choice('messages.resume.pdf.age', (int) $age);
                }
                if (!empty($born)) {
                    $ageBirth .= ($ageBirth ? ' · ' : '') . __('messages.resume.pdf.birth_date') . ': ' . $born;
                }
                $contacts = array_values(array_filter([$phone, $email]));
            @endphp
            <div class="head-meta">
                @if(!empty($address))
                    <div class="meta">{{ $address }}</div>
                @endif
                @if($ageBirth)
                    <div class="meta">{{ $ageBirth }}</div>
                @endif
                @if(count($contacts))
                    <div class="meta">{{ implode(' · ', $contacts) }}</div>
                @endif
            </div>
        </td>
        <td class="head-logo">
            @if(!empty($logo))
                <img src="{{ $logo }}" class="logo-img" alt="JUMYSTAP">
            @endif
        </td>
    </tr>
</table>
<div class="head-divider"></div>

{{-- 01 Work experience --}}
@if(!empty($experience))
    @php $n++; @endphp
    <div class="section">
        {!! $sectionHead($n, __('messages.resume.pdf.section_experience')) !!}
        @foreach($experience as $job)
            <div class="item">
                <div class="item-title">{{ $job['title'] }}</div>
                @if(!empty($job['company']))
                    <div class="item-sub">{{ $job['company'] }}</div>
                @endif
                @if(!empty($job['period']))
                    <div class="item-period">{{ $job['period'] }}</div>
                @endif
                @if(!empty($job['responsibilities']))
                    <div class="item-desc">{{ $job['responsibilities'] }}</div>
                @endif
            </div>
        @endforeach
    </div>
@endif

{{-- JOLTAP graduate --}}
@if(!empty($is_graduate))
    @php $n++; @endphp
    <div class="section">
        {!! $sectionHead($n, __('messages.resume.pdf.section_joltap')) !!}
        <div class="item">
            <div class="item-title">{{ __('messages.resume.pdf.joltap_note') }}</div>
        </div>
    </div>
@endif

{{-- Professional skills --}}
@if(!empty($skills))
    @php $n++; @endphp
    <div class="section">
        {!! $sectionHead($n, __('messages.resume.pdf.section_skills')) !!}
        <ul class="skills">
            @foreach($skills as $skill)
                <li>{{ $skill }}</li>
            @endforeach
        </ul>
    </div>
@endif

{{-- Education --}}
@php
    $hasEducation = !empty($education['degree']) || !empty($education['education_level'])
        || !empty($education['institution']) || !empty($education['period']);
@endphp
@if($hasEducation)
    @php $n++; @endphp
    <div class="section">
        {!! $sectionHead($n, __('messages.resume.pdf.section_education')) !!}
        <div class="item">
            @if(!empty($education['degree']))
                <div class="item-title">{{ $education['degree'] }}</div>
            @endif
            @if(!empty($education['institution']))
                <div class="item-sub">{{ $education['institution'] }}</div>
            @endif
            @php
                $eduMeta = array_values(array_filter([
                    $education['education_level'] ?? '',
                    $education['period'] ?? '',
                ]));
            @endphp
            @if(count($eduMeta))
                <div class="item-period">{{ implode(' · ', $eduMeta) }}</div>
            @endif
            @if(!empty($languages))
                <div class="item-desc">{{ __('messages.resume.pdf.languages') }}: {{ $languages }}</div>
            @endif
        </div>
    </div>
@endif

{{-- Additional --}}
@php
    $addMeta = [];
    $addMeta[] = $ip_status ? __('messages.resume.pdf.ip_yes') : __('messages.resume.pdf.ip_no');
    $addMeta[] = $has_car ? __('messages.resume.pdf.car_yes') : __('messages.resume.pdf.car_no');
    if (!empty($driving_license_title)) {
        $addMeta[] = __('messages.resume.pdf.driving_license') . ': ' . $driving_license_title;
    }
@endphp
@if(!empty($about) || count($addMeta))
    @php $n++; @endphp
    <div class="section">
        {!! $sectionHead($n, __('messages.resume.pdf.section_additional')) !!}
        <div class="item">
            @if(!empty($about))
                <div class="item-title add-about">{{ $about }}</div>
            @endif
            @if(count($addMeta))
                <div class="item-period">{{ implode(' · ', $addMeta) }}</div>
            @endif
        </div>
    </div>
@endif
</div>
</body>
</html>
