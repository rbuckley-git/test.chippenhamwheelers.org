# Broken Links Audit

Audit target: `https://dev.chippenhamwheelers.org`

The audit checked the deployed sitemap and internal links found in sitemap pages and posts.

- 469 sitemap URLs checked successfully.
- 71 unique internal linked URLs remain after the nested Club Activities aliases were added.
- Existing `/events/` migration redirects were not included as broken links.
- External links were not assessed.

## Broken legacy pages

```text
/2023-time-trials/
/about-us/club-history-1882-to-2023/
/about-us/committee/
/audax-season-update-and-paris-brest-paris-1200km/
/audax-series-2023-final-results-medals/
/audax-series-provisional-results/
/august-bank-holiday-club-bbq-treasure-hunt/
/charity-ride-in-aid-of-our-charity-of-the-year-doorway/
/chippenham-and-district-wheelers-to-join-chippenham-sports-club/
/club-2022-time-trial-report/
/club-annual-dinner-awards-night-2020/
/club-audax-series-2020/
/club-kit-purchasing-window/
/club-virtual-agm-2020/agm_agenda_2020-2/
/club-virtual-agm-2020/meetings_2019_agm-minutes/
/coaching-bulletin/
/cycling-focussed-strength-and-conditioning-training-sessions-with-martin-priestley/
/doing-anything-weekend-20-21-july/
/eric-fletcher/
/flapjack-100k-open-audax/
/fletchers-flapjack-24/
/forum/2017-racing-calendar/
/forums/chippenham-wheelers-members-forum/racing/
/kilo-and-half-kilo-1-january-2019/
/locations/springfield-sports-centre/
/lottery-2-up-results-8-may-2019/
/national-rttc-24-hour-time-trial-organised-by-mersey-road-club/
/paris-brest-paris-1200km-randonneur-the-blog/
/ride-a-winter-100-for-the-nhs/
/sheila-edwards-1935-2018/
/the-open-time-trial-championship-2021/
/time-trial-2023-end-of-season-report/
/virtual-world-cycling-activities-an-update/
/volunteers-needed-saturday-4-may/
/your-club/
/youth/induction-programme-2020/
```

## Broken old URL structures

```text
/news/2014-08-19/appreciating-tommy%22/
/news/2014-09-08/ted-barlow-1930-2014%22/
/news/2014-10-30/club-clothing-update%22/
/page/club-time-trial-records/
/page/ctt-2014-entry-forms/
/page/racing-2012/
/page/racing-2013/
/page/racing-2014/
/page/racing-2015/
/page/racing-2016/
/page/team-time-trial-advice-and-guidance/
/page/time-trial-competition-count-back-explanation/
/page/track-cycling-newport-velodrome/
/racing/2018-time-trial-events/
/racing/2018-time-trial-page/
/racing/2019-time-trial-page/
/racing/2019-time-trial-page/2019-time-trial-results/
/racing/chippenham-wheelers-time-trial-course-maps/
/racing/chippenham-wheelers-time-trial-records/
/racing/club-time-trial-competitions/
/racing/historic-racing-pages/
/racing/racing-page-2017/
/racing/road-racing/
/racing/time-trial-report-2017/
```

## Broken files and legacy resources

```text
/sites/default/files/2013-Time-Trial-Report.pdf
/sites/default/files/2014-Time-Trial-Report.pdf
/sites/default/files/Chippenham%20Wheelers%202012%20Time%20Trial%20Report.pdf
/sites/default/files/Chippenham_Wheelers_2015_Time_Trial_Report.pdf
/sites/default/files/Chippenham_Wheelers_2016_Time_Trial_Report.pdf
/sites/default/files/imagecache/page-pic-360px/images/page/image.jpg
/survey/index.php
/wp-content/uploads/2025/09/20250901-Chippenham-Wheelers-Time-Trial-Records-Current-and-Historic-September-2025.pdf
/wp-content/uploads/2025/11/2024-11-27-AGM-Minutes.pdf
/wp-content/uploads/2026/01/2025-12-08-committee-minutes.pdf
/wp-content/uploads/2026/08/2026-06-01-committee-minutes.pdf
```

Many entries are old imported links. They should either be redirected to their migrated equivalent or removed from the originating content.

## Resolved through nested aliases

The following links were removed from the broken-link list after adding nested Club Activities aliases:

| Link | Found in |
| --- | --- |
| `/club-activities/audax-series/` | `/posts/audax-series-2022/`, `/posts/club-newsletter-autumn-2023/`, `/posts/club-newsletter-winter-2024/` |
| `/club-activities/castle-coombe-circuit/` | `/posts/club-newsletter-april-2019/`, `/training/` |
| `/club-activities/insurance/` | `/posts/club-newsletter-winter-2024/` |
| `/club-activities/track-cycling/` | `/posts/club-winter-track-sessions-announced/`, `/posts/newport-velodrome-winter-track-sessions-announced/` |
| `/club-activities/weekend-rides/` | `/posts/club-newsletter-spring-2023/` |
| `/club-activities/weekend-rides/chain-ganging/` | `/training/`, `/weekend-rides/` |
