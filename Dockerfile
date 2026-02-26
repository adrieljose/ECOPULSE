FROM php:8.2-apache

# Install PDO MySQL extension
RUN docker-php-ext-install pdo pdo_mysql

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Copy project files to Apache root
COPY . /var/www/html/

# Expose port (Render sets PORT environment variable, Apache defaults to 80, Render maps it)
EXPOSE 80

# The default apache2-foreground command will start the server
