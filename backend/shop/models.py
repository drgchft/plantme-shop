from django.db import models

class Category(models.Model):
    """Категория растений"""
    name = models.CharField('Название', max_length=100)
    slug = models.SlugField('URL', max_length=100, unique=True)
    description = models.TextField('Описание', blank=True)
    image = models.ImageField('Изображение', upload_to='categories/', blank=True, null=True)
    
    class Meta:
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Plant(models.Model):
    """Модель растения"""
    
    DIFFICULTY_CHOICES = [
        ('easy', 'Легкий'),
        ('medium', 'Средний'),
        ('hard', 'Сложный'),
    ]
    
    name = models.CharField('Название', max_length=200)
    slug = models.SlugField('URL', max_length=200, unique=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, 
                                related_name='plants')
    description = models.TextField('Описание')
    price = models.DecimalField('Цена', max_digits=10, decimal_places=2)
    discount_price = models.DecimalField('Цена со скидкой', max_digits=10, 
                                        decimal_places=2, blank=True, null=True)
    care_difficulty = models.CharField('Сложность ухода', max_length=10, 
                                      choices=DIFFICULTY_CHOICES, default='medium')
    light_requirements = models.CharField('Требования к свету', max_length=100)
    watering_frequency = models.CharField('Частота полива', max_length=100)
    height = models.CharField('Высота', max_length=50, blank=True)
    pot_diameter = models.CharField('Диаметр горшка', max_length=50, blank=True)
    
    main_image = models.ImageField('Основное изображение', upload_to='plants/')
    additional_images = models.JSONField('Дополнительные изображения', 
                                        default=list, blank=True)
    
    in_stock = models.BooleanField('В наличии', default=True)
    is_featured = models.BooleanField('Рекомендуемый', default=False)
    is_new = models.BooleanField('Новинка', default=False)
    rating = models.FloatField('Рейтинг', default=0.0)
    review_count = models.IntegerField('Количество отзывов', default=0)
    
    created_at = models.DateTimeField('Дата добавления', auto_now_add=True)
    updated_at = models.DateTimeField('Дата обновления', auto_now=True)
    
    class Meta:
        verbose_name = 'Растение'
        verbose_name_plural = 'Растения'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['name', 'category']),
            models.Index(fields=['price']),
            models.Index(fields=['is_featured']),
        ]
    
    def __str__(self):
        return self.name
    
    @property
    def current_price(self):
        """Возвращает текущую цену (со скидкой если есть)"""
        return self.discount_price if self.discount_price else self.price
    
    @property
    def discount_percent(self):
        """Рассчитывает процент скидки"""
        if self.discount_price and self.price:
            return int((1 - self.discount_price / self.price) * 100)
        return 0