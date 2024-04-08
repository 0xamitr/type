def create_user(cur, connector, name, password, email):
    try:
        cur.execute(
            '''INSERT INTO users(
            username, password, email
            ) VALUES (%s, %s, %s)''', (name, password, email)
        )
        connector.connection.commit()
    except Exception as err:
        raise err
    
def handle_submit(cur, connector, wpm, accuracy, email, iscode):
    print("email", email)
    # try:
    #     cur.execute(
    #         '''SELECT username,
    #             text_total_tests,
    #             text_tests_today,
    #             code_total_tests,
    #             code_tests_today,
    #             avg_code_accuracy_today,
    #             avg_text_accuracy_today,
    #             avg_code_accuracy,
    #             avg_text_accuracy,
    #             avg_code_wpm,
    #             avg_text_wpm,
    #             avg_code_wpm_today,
    #             avg_text_wpm_today,
    #             highest_text_wpm_ever,
    #             highest_text_wpm_today,
    #             highest_text_accuracy_today,
    #             highest_code_wpm_ever,
    #             highest_code_wpm_today,
    #             highest_code_accuracy_today
    #         FROM users WHERE email=%s''', (email,))
    #     data = cur.fetchone()  # Fetch only one row
    #     if data:  # Check if data is not None
    #           # Access column values using keys
    #         text_total_tests = data.get('text_total_tests')
    #         text_tests_today = data.get('text_tests_today')
    #         avg_text_wpm_today = data.get('avg_text_wpm_today')
    #         avg_text_accuracy = data.get('avg_text_accuracy')
    #         avg_text_accuracy_today = data.get('avg_text_accuracy_today')
    #         avg_text_wpm = data.get('avg_text_wpm')

    #         # Perform your calculations here
    #         new_total_tests = text_total_tests + 1
    #         new_total_tests_today = text_tests_today + 1
            
    #         # Ensure that values are not None before adding
    #         avg_text_wpm_today += wpm
    #         avg_text_wpm += wpm
    #         avg_text_accuracy += accuracy
    #         avg_text_accuracy_today += accuracy

    #         cur.execute(
    #         '''UPDATE users 
    #         SET text_total_tests = %s,
    #             text_tests_today = %s,
    #             avg_text_wpm_today = %s,
    #             avg_text_accuracy = %s,
    #             avg_text_accuracy_today = %s,
    #             avg_text_wpm = %s
    #         WHERE email=%s''',
    #         (new_total_tests, new_total_tests_today, avg_text_wpm_today, avg_text_accuracy, avg_text_accuracy_today, avg_text_wpm, email))
    #         connector.connection.commit()
    #     else:
    #         print("No data found for email:", email)
    #         # Handle the case where no data is found for the given email
    try:
        if(iscode):
            cur.execute(
                '''SELECT ,'''
            )
            data = cur.fetchone()
            cur.execute(
                '''UPDATE users '''
            )
            cur.close()
        else:
            cur.execute(
                '''SELECT ,'''
            )
            data = cur.fetchone()
            cur.execute(
                '''UPDATE users '''
            )
            cur.close()
    except Exception as err:
        raise err

