<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SpecializationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $category_id = DB::table('specialization_categories')->where('name_ru', 'Швейное дело')->first()->id;

        DB::table('specializations')->insert([
            ['name_ru' => 'Швея', 'name_kz' => 'Тігінші', 'category_id' => $category_id],
            ['name_ru' => 'Закройщик', 'name_kz' => 'Киім пішуші', 'category_id' => $category_id],
            ['name_ru' => 'Ткач', 'name_kz' => 'Тоқымашы', 'category_id' => $category_id],
        ]);

        $category_id = DB::table('specialization_categories')->where('name_ru', 'Общепит')->first()->id;

        DB::table('specializations')->insert([
            ['name_ru' => 'Помощник повара', 'name_kz' => 'Аспаз көмекшісі', 'category_id' => $category_id],
            ['name_ru' => 'Повар', 'name_kz' => 'Аспаз', 'category_id' => $category_id],
            ['name_ru' => 'Сушист', 'name_kz' => 'Сушист', 'category_id' => $category_id],
            ['name_ru' => 'Су-шеф', 'name_kz' => 'Су-шеф', 'category_id' => $category_id],
            ['name_ru' => 'Кондитер', 'name_kz' => 'Кондитер', 'category_id' => $category_id],
            ['name_ru' => 'Заготовщик', 'name_kz' => 'Дайындаушы', 'category_id' => $category_id],
            ['name_ru' => 'Кух. рабочие', 'name_kz' => 'Ас үй жұмысшылары', 'category_id' => $category_id],
            ['name_ru' => 'Лепщик пельменей', 'name_kz' => 'Тұшпара жапсырушы', 'category_id' => $category_id],
            ['name_ru' => 'Формовщик', 'name_kz' => 'Қалыптаушы', 'category_id' => $category_id],
            ['name_ru' => 'Пекарь', 'name_kz' => 'Наубайшы', 'category_id' => $category_id],
            ['name_ru' => 'Мясник', 'name_kz' => 'Қасапшы', 'category_id' => $category_id],
            ['name_ru' => 'Сборщик-фасовщик', 'name_kz' => 'Жинаушы-бөлшектеп өлшеуші', 'category_id' => $category_id],
            ['name_ru' => 'Мангальщик', 'name_kz' => 'Мангальщик', 'category_id' => $category_id],
        ]);

        $category_id = DB::table('specialization_categories')->where('name_ru', 'Торговля и продажи')->first()->id;

        DB::table('specializations')->insert([
            ['name_ru' => 'Продавец-кассир', 'name_kz' => 'Сатушы-кассир', 'category_id' => $category_id],
            ['name_ru' => 'Контролер зала', 'name_kz' => 'Зал бақылаушысы', 'category_id' => $category_id],
            ['name_ru' => 'Кассир', 'name_kz' => 'Кассир', 'category_id' => $category_id],
            ['name_ru' => 'Продавец', 'name_kz' => 'Сатушы', 'category_id' => $category_id],
            ['name_ru' => 'Продавец-консультант', 'name_kz' => 'Сатушы-консультант', 'category_id' => $category_id],
            ['name_ru' => 'Менеджер по продажам', 'name_kz' => 'Сату менеджері', 'category_id' => $category_id],
            ['name_ru' => 'Оператор call-центра', 'name_kz' => 'Call-центр операторы', 'category_id' => $category_id],
            ['name_ru' => 'Флорист', 'name_kz' => 'Флорист', 'category_id' => $category_id],
            ['name_ru' => 'Торговый представитель', 'name_kz' => 'Сауда өкілі', 'category_id' => $category_id],
            ['name_ru' => 'Мерчандайзер, товаровед', 'name_kz' => 'Мерчандайзер, тауартанушы', 'category_id' => $category_id],
        ]);

        $category_id = DB::table('specialization_categories')->where('name_ru', 'Сварщики')->first()->id;

        DB::table('specializations')->insert([
            ['name_ru' => 'Сварщик', 'name_kz' => 'Дәнекерлеуші', 'category_id' => $category_id],
            ['name_ru' => 'Электрогазосварщик', 'name_kz' => 'Электргазбен дәнекерлеуші', 'category_id' => $category_id],
        ]);

        $category_id = DB::table('specialization_categories')->where('name_ru', 'Образование ')->first()->id;

        DB::table('specializations')->insert([
            ['name_ru' => 'Администратор', 'name_kz' => 'Администратор', 'category_id' => $category_id],
            ['name_ru' => 'Преподаватель, учитель', 'name_kz' => 'Оқытушы, мұғалім', 'category_id' => $category_id],
            ['name_ru' => 'Лаборант', 'name_kz' => 'Лаборант', 'category_id' => $category_id],
            ['name_ru' => 'Няня', 'name_kz' => 'Күтуші', 'category_id' => $category_id],
            ['name_ru' => 'Воспитатель', 'name_kz' => 'тәрбиеші', 'category_id' => $category_id],
            ['name_ru' => 'Методист', 'name_kz' => 'Методист', 'category_id' => $category_id],
            ['name_ru' => 'Логопед', 'name_kz' => 'Логопед', 'category_id' => $category_id],
            ['name_ru' => 'Репетитор', 'name_kz' => 'Репетитор', 'category_id' => $category_id],
        ]);

        $category_id = DB::table('specialization_categories')->where('name_ru', 'Рабочий и тех. персонал')->first()->id;

        DB::table('specializations')->insert([
            ['name_ru' => 'Грузчики', 'name_kz' => 'Жүкші', 'category_id' => $category_id],
            ['name_ru' => 'Истопщик печей', 'name_kz' => 'Истопщик печей', 'category_id' => $category_id],
            ['name_ru' => 'Приемщик товара', 'name_kz' => 'Тауарды қабылдаушы', 'category_id' => $category_id],
            ['name_ru' => 'Кладовщики (завскладом)', 'name_kz' => 'Қоймашылар (қойма меңгерушісі)', 'category_id' => $category_id],
            ['name_ru' => 'Чистка обуви', 'name_kz' => 'Аяқ киімді тазалаушы', 'category_id' => $category_id],
            ['name_ru' => 'Охранник', 'name_kz' => 'Күзетші', 'category_id' => $category_id],
            ['name_ru' => 'Тех. персонал', 'name_kz' => 'Тех. персонал', 'category_id' => $category_id],
            ['name_ru' => 'Работник прачечной', 'name_kz' => 'Кір жуу қызметтері', 'category_id' => $category_id],
        ]);

        $category_id = DB::table('specialization_categories')->where('name_ru', 'Медицина, фармацевтика')->first()->id;

        DB::table('specializations')->insert([
            ['name_ru' => 'Медицинская сестра, медицинский брат', 'name_kz' => 'Медбике/Мейіргер', 'category_id' => $category_id],
            ['name_ru' => 'Врач', 'name_kz' => 'Дәрігер', 'category_id' => $category_id],
            ['name_ru' => 'Лаборант', 'name_kz' => 'Лаборант', 'category_id' => $category_id],
            ['name_ru' => 'Фармацевт', 'name_kz' => 'Фармацевт', 'category_id' => $category_id],
        ]);

        $category_id = DB::table('specialization_categories')->where('name_ru', 'Транспорт')->first()->id;

        DB::table('specializations')->insert([
            ['name_ru' => 'Водитель легковой машины', 'name_kz' => 'Жолаушылар көлігінің жүргізушісі', 'category_id' => $category_id],
            ['name_ru' => 'Водитель автобуса', 'name_kz' => 'Автобус жүргізушісі', 'category_id' => $category_id],
            ['name_ru' => 'Водитель грузового', 'name_kz' => 'Жүк жүргізушісі', 'category_id' => $category_id],
            ['name_ru' => 'Водитель спец. техники', 'name_kz' => 'Арнайы техника жүргізушісі', 'category_id' => $category_id],
            ['name_ru' => 'Диспетчер', 'name_kz' => 'Диспетчер', 'category_id' => $category_id],
        ]);

        $category_id = DB::table('specialization_categories')->where('name_ru', 'Финансы и право')->first()->id;

        DB::table('specializations')->insert([
            ['name_ru' => 'Бухгалтер', 'name_kz' => 'Бухгалтер', 'category_id' => $category_id],
            ['name_ru' => 'Юрист', 'name_kz' => 'Заңгер', 'category_id' => $category_id],
            ['name_ru' => 'Кредитный менеджер', 'name_kz' => 'Несие менеджері', 'category_id' => $category_id],
            ['name_ru' => 'Оператор 1С', 'name_kz' => 'Оператор 1С', 'category_id' => $category_id],
        ]);

        $category_id = DB::table('specialization_categories')->where('name_ru', 'Курьеры')->first()->id;

        DB::table('specializations')->insert([
            ['name_ru' => 'Курьер', 'name_kz' => 'Курьер', 'category_id' => $category_id],
            ['name_ru' => 'Почтальон', 'name_kz' => 'Пошташы', 'category_id' => $category_id],
        ]);

        $category_id = DB::table('specialization_categories')->where('name_ru', 'Салон красоты, фитнес, спорт')->first()->id;

        DB::table('specializations')->insert([
            ['name_ru' => 'Мастер ресничного сервиса', 'name_kz' => 'Кірпік сервисінің шебері', 'category_id' => $category_id],
            ['name_ru' => 'Мастер ногтевого сервиса', 'name_kz' => 'Тырнақ сервисінің шебері', 'category_id' => $category_id],
            ['name_ru' => 'Парикмахер ', 'name_kz' => 'Шаштараз', 'category_id' => $category_id],
            ['name_ru' => 'Фитнес тренер, инструктор', 'name_kz' => 'Фитнес жаттыұтырушы, инструктор', 'category_id' => $category_id],
            ['name_ru' => 'Массажист', 'name_kz' => 'Массажист', 'category_id' => $category_id],
            ['name_ru' => 'Косметолог', 'name_kz' => 'Косметолог', 'category_id' => $category_id],
            ['name_ru' => 'Пилингист', 'name_kz' => 'Пилингист', 'category_id' => $category_id],
        ]);

        $category_id = DB::table('specialization_categories')->where('name_ru', 'Туризм, гостиницы, рестораны')->first()->id;

        DB::table('specializations')->insert([
            ['name_ru' => 'Администратор', 'name_kz' => 'Администратор', 'category_id' => $category_id],
            ['name_ru' => 'Менеджер по туризму', 'name_kz' => 'Туризм менеджері', 'category_id' => $category_id],
            ['name_ru' => 'Хостес', 'name_kz' => 'Хостес', 'category_id' => $category_id],
            ['name_ru' => 'Официант', 'name_kz' => 'Даящы', 'category_id' => $category_id],
            ['name_ru' => 'Бармен', 'name_kz' => 'Бармен', 'category_id' => $category_id],
            ['name_ru' => 'Раннер ', 'name_kz' => 'Раннер ', 'category_id' => $category_id],
            ['name_ru' => 'Уборщица, уборщик', 'name_kz' => 'Тазалаушы', 'category_id' => $category_id],
            ['name_ru' => 'Горничная', 'name_kz' => 'Горничная', 'category_id' => $category_id],
            ['name_ru' => 'Менеджер/руководитель АХО', 'name_kz' => 'ӘШБ менеджері / жетекшісі', 'category_id' => $category_id],
        ]);

        $category_id = DB::table('specialization_categories')->where('name_ru', 'Производство')->first()->id;

        DB::table('specializations')->insert([
            ['name_ru' => 'Наждачник ', 'name_kz' => 'Наждачник ', 'category_id' => $category_id],
            ['name_ru' => 'Сборщик мебели', 'name_kz' => 'Жиһаз жинаушы', 'category_id' => $category_id],
            ['name_ru' => 'Чистильщик литья', 'name_kz' => 'Чистильщик литья', 'category_id' => $category_id],
            ['name_ru' => 'Оператор пилорамы', 'name_kz' => 'Ағаш тілгіш операторы', 'category_id' => $category_id],
            ['name_ru' => 'Инженер', 'name_kz' => 'Инженер', 'category_id' => $category_id],
            ['name_ru' => 'Начальник участка, мастер участка', 'name_kz' => 'Учаске бастығы, учаске шебері', 'category_id' => $category_id],
            ['name_ru' => 'Оператор производственной линии', 'name_kz' => 'Өндірістік желі операторы', 'category_id' => $category_id],
            ['name_ru' => 'Стропальщик ', 'name_kz' => 'Стропальщик ', 'category_id' => $category_id],
            ['name_ru' => 'Специалист по реставрации мебели', 'name_kz' => 'Жиһазды қалпына келтіру жөніндегі маман', 'category_id' => $category_id],
            ['name_ru' => 'Оператор на плоттер', 'name_kz' => 'Плоттер операторы', 'category_id' => $category_id],
            ['name_ru' => 'Электрик', 'name_kz' => 'Электрші', 'category_id' => $category_id],
            ['name_ru' => 'Токарь, фрезеровщик, шлифовщик', 'name_kz' => 'Токарь, фрезерші, ажарлаушы', 'category_id' => $category_id],
            ['name_ru' => 'Экструдерщик', 'name_kz' => 'Экструдерщик', 'category_id' => $category_id],
        ]);

        $category_id = DB::table('specialization_categories')->where('name_ru', 'Строительство и ремонт')->first()->id;

        DB::table('specializations')->insert([
            ['name_ru' => 'Монтажник фасада', 'name_kz' => 'Фасад монтаждаушы', 'category_id' => $category_id],
            ['name_ru' => 'Монтажник', 'name_kz' => 'Монтаждаушы', 'category_id' => $category_id],
            ['name_ru' => 'Инженер', 'name_kz' => 'Инженер', 'category_id' => $category_id],
            ['name_ru' => 'Маляр', 'name_kz' => 'Сырлаушы', 'category_id' => $category_id],
            ['name_ru' => 'Столяр', 'name_kz' => 'Ағаш ұстасы', 'category_id' => $category_id],
            ['name_ru' => 'Демонтаж рекламы', 'name_kz' => 'Жарнама демонтажы', 'category_id' => $category_id],
            ['name_ru' => 'Начальник участка ', 'name_kz' => 'Учаске бастығы', 'category_id' => $category_id],
            ['name_ru' => 'Автокрановщик', 'name_kz' => 'Автокраншы', 'category_id' => $category_id],
            ['name_ru' => 'Дорожный рабочий', 'name_kz' => 'Жол жұмысшысы', 'category_id' => $category_id],
            ['name_ru' => 'Электрик', 'name_kz' => 'Электрші', 'category_id' => $category_id],
            ['name_ru' => 'Электромонтажник', 'name_kz' => 'Электрмонтаждаушы', 'category_id' => $category_id],
            ['name_ru' => 'Слесарь', 'name_kz' => 'Слесарь', 'category_id' => $category_id],
            ['name_ru' => 'Кровельщик', 'name_kz' => 'Шатыршы', 'category_id' => $category_id],
        ]);

        $category_id = DB::table('specialization_categories')->where('name_ru', 'Офисная работа')->first()->id;

        DB::table('specializations')->insert([
            ['name_ru' => 'HR менеджер', 'name_kz' => 'HR менеджер', 'category_id' => $category_id],
            ['name_ru' => 'Страховой агент', 'name_kz' => 'Сақтандыру агенті', 'category_id' => $category_id],
            ['name_ru' => 'Специалист по документообороту ', 'name_kz' => 'Құжат айналымы жөніндегі маман', 'category_id' => $category_id],
            ['name_ru' => 'Гос. закупщик', 'name_kz' => 'Мемлекеттік сатып алушы', 'category_id' => $category_id],
            ['name_ru' => 'Ассистент руководителя', 'name_kz' => 'Басшы көмекшісі', 'category_id' => $category_id],
            ['name_ru' => 'Оператор call-центра', 'name_kz' => 'Сall-центра операторы', 'category_id' => $category_id],
            ['name_ru' => 'Секретарь', 'name_kz' => 'Хатшы', 'category_id' => $category_id],
        ]);

        $category_id = DB::table('specialization_categories')->where('name_ru', 'Маркетинг и PR')->first()->id;

        DB::table('specializations')->insert([
            ['name_ru' => 'Мобилограф', 'name_kz' => 'Мобилограф', 'category_id' => $category_id],
            ['name_ru' => 'СММ', 'name_kz' => 'СММ', 'category_id' => $category_id],
            ['name_ru' => 'Копирайтер', 'name_kz' => 'Копирайтер', 'category_id' => $category_id],
            ['name_ru' => 'Графический дизайнер', 'name_kz' => 'Графикалық дизайнер', 'category_id' => $category_id],
            ['name_ru' => 'Видеограф', 'name_kz' => 'Видеограф', 'category_id' => $category_id],
            ['name_ru' => 'Маркетолог', 'name_kz' => 'Маркетолог', 'category_id' => $category_id],
            ['name_ru' => 'Пресс-секретарь', 'name_kz' => 'Баспасөз хатшысы', 'category_id' => $category_id],
            ['name_ru' => 'Таргетолог', 'name_kz' => 'Таргетолог', 'category_id' => $category_id],
        ]);

        $category_id = DB::table('specialization_categories')->where('name_ru', 'Автосервис')->first()->id;

        DB::table('specializations')->insert([
            ['name_ru' => 'Замена масла', 'name_kz' => 'Май ауыстырушы', 'category_id' => $category_id],
            ['name_ru' => 'Менеджер АЗС', 'name_kz' => 'Жанармай құю станциясының менеджері', 'category_id' => $category_id],
            ['name_ru' => 'Оператор АЗС', 'name_kz' => 'Жанармай құю станциясының операторы', 'category_id' => $category_id],
            ['name_ru' => 'Моторист', 'name_kz' => 'Моторшы', 'category_id' => $category_id],
            ['name_ru' => 'Автоэлектрик', 'name_kz' => 'Автоэлектрик', 'category_id' => $category_id],
            ['name_ru' => 'Автомеханик', 'name_kz' => 'Автомеханик', 'category_id' => $category_id],
            ['name_ru' => 'Автомойщик', 'name_kz' => 'Көлік жуушы', 'category_id' => $category_id],
            ['name_ru' => 'Автослесарь', 'name_kz' => 'Автослесарь', 'category_id' => $category_id],
        ]);

        $category_id = DB::table('specialization_categories')->where('name_ru', 'Бариста')->first()->id;

        DB::table('specializations')->insert([
            ['name_ru' => 'Бариста', 'name_kz' => 'Бариста', 'category_id' => $category_id],
        ]);

        $category_id = DB::table('specialization_categories')->where('name_ru', 'Развлечения')->first()->id;

        DB::table('specializations')->insert([
            ['name_ru' => 'Гончар', 'name_kz' => 'Гончар', 'category_id' => $category_id],
            ['name_ru' => 'Звукооператор', 'name_kz' => 'дыбыс операторы', 'category_id' => $category_id],
            ['name_ru' => 'Администратор', 'name_kz' => 'Администратор', 'category_id' => $category_id],
        ]);

        $category_id = DB::table('specialization_categories')->where('name_ru', 'IT ')->first()->id;

        DB::table('specializations')->insert([
            ['name_ru' => 'IT специалист', 'name_kz' => 'IT-маман', 'category_id' => $category_id],
            ['name_ru' => 'Системный администратор', 'name_kz' => 'Жүйе әкімшісі', 'category_id' => $category_id],
            ['name_ru' => 'Разработчик сайтов', 'name_kz' => 'Сайт жасаушы', 'category_id' => $category_id],
        ]);
    }
}

