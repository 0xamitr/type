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
    print("Entering handle_submit function")
    print("wpm :", (wpm))
    print("accuracy :", (accuracy))
    print("email:", email)
    print("iscode:", iscode)
    try:
        if(iscode):
            print("Processing code submission")
            cur.execute(
                '''SELECT code_tests, code_tests_today,
                cumm_code_accuracy, cumm_code_accuracy_today,
                cumm_code_wpm, cumm_code_wpm_today, highest_code_wpm_ever,
                highest_code_wpm_today, highest_code_accuracy_today FROM users
                WHERE email = %s''', (email,)
            )
            data = cur.fetchone()
            # print("Retrieved data from database:", data)
            new_code_tests = data['code_tests'] + 1
            new_code_tests_today = data['code_tests_today'] + 1
            new_cumm_code_accuracy = data['cumm_code_accuracy'] + accuracy
            new_cumm_code_accuracy_today = data['cumm_code_accuracy_today'] + accuracy
            new_cumm_code_wpm = data['cumm_code_wpm'] + wpm
            new_cumm_code_wpm_today = data['cumm_code_wpm_today'] + wpm
            new_highest_code_wpm_ever = data['highest_code_wpm_ever']
            new_highest_code_wpm_today = data['highest_code_wpm_today']
            new_highest_code_accuracy_today = data['highest_code_accuracy_today']
            print("ok")
            print("Calculations done")
            if(wpm > data['highest_code_wpm_ever']):
                new_highest_code_wpm_ever = wpm
            else:
                new_highest_code_wpm_ever = data['highest_code_wpm_ever']
            if(wpm > data['highest_code_wpm_today']):
                new_highest_code_wpm_today = wpm
            else:
                new_highest_code_wpm_today = data['highest_code_wpm_today']
            if(accuracy > data['highest_code_accuracy_today']):
                new_highest_code_accuracy_today = accuracy
            else:
                new_highest_code_accuracy_today = data['highest_code_accuracy_today']
            print("Updating database")
            cur.execute(
                '''UPDATE users 
                SET code_tests = %s,
                    code_tests_today = %s,
                    cumm_code_accuracy = %s, 
                    cumm_code_accuracy_today = %s,
                    cumm_code_wpm = %s, 
                    cumm_code_wpm_today = %s, 
                    highest_code_wpm_ever = %s,
                    highest_code_wpm_today = %s, 
                    highest_code_accuracy_today = %s 
                    WHERE email = %s''', (new_code_tests, new_code_tests_today, new_cumm_code_accuracy,
                        new_cumm_code_accuracy_today, new_cumm_code_wpm, new_cumm_code_wpm_today, new_highest_code_wpm_ever,
                        new_highest_code_wpm_today, new_highest_code_accuracy_today, email,)
            )
            print("Database update complete")
            connector.connection.commit()
        else:
            print("Processing text submission")
            cur.execute(
            '''SELECT text_tests, text_tests_today,
            cumm_text_accuracy, cumm_text_accuracy_today,
            cumm_text_wpm, cumm_text_wpm_today, highest_text_wpm_ever,
            highest_text_wpm_today, highest_text_accuracy_today FROM users
            WHERE email = %s''', (email,)
            )
            data = cur.fetchone()
            print("Retrieved data from database:", data)
            new_text_tests = data['text_tests'] + 1
            new_text_tests_today = data['text_tests_today'] + 1
            new_cumm_text_accuracy = data['cumm_text_accuracy'] + accuracy
            new_cumm_text_accuracy_today = data['cumm_text_accuracy_today'] + accuracy
            new_cumm_text_wpm = data['cumm_text_wpm'] + wpm
            new_cumm_text_wpm_today = data['cumm_text_wpm_today'] + wpm
            new_highest_text_wpm_ever = data['highest_text_wpm_ever']
            new_highest_text_wpm_today = data['highest_text_wpm_today']
            new_highest_text_accuracy_today = data['highest_text_accuracy_today']
            print("Calculations done")
            if wpm > data['highest_text_wpm_ever']:
                new_highest_text_wpm_ever = wpm
            if wpm > data['highest_text_wpm_today']:
                new_highest_text_wpm_today = wpm
            if accuracy > data['highest_text_accuracy_today']:
                new_highest_text_accuracy_today = accuracy
            print("Updating database")
            cur.execute(
                '''UPDATE users 
                SET text_tests = %s,
                    text_tests_today = %s,
                    cumm_text_accuracy = %s, 
                    cumm_text_accuracy_today = %s,
                    cumm_text_wpm = %s, 
                    cumm_text_wpm_today = %s, 
                    highest_text_wpm_ever = %s,
                    highest_text_wpm_today = %s, 
                    highest_text_accuracy_today = %s
                    WHERE email = %s''', 
                (new_text_tests, new_text_tests_today, new_cumm_text_accuracy,
                new_cumm_text_accuracy_today, new_cumm_text_wpm, new_cumm_text_wpm_today, 
                new_highest_text_wpm_ever, new_highest_text_wpm_today, 
                new_highest_text_accuracy_today, email,)
            )
            print("Database update complete")
            connector.connection.commit()
    except Exception as err:
        print("An error occurred:", err)
        raise err


def reset(cur, connector):
    cur.execute('''SELECT * FROM users''')
    cur.execute('''UPDATE users SET text_tests_today = %s, code_tests_today = %s, cumm_code_accuracy_today = %s, 
        cumm_text_accuracy_today = %s, cumm_code_wpm_today = %s, cumm_text_wpm_today = %s, highest_text_accuracy_today = %s,
        highest_code_wpm_today = %s, highest_code_accuracy_today = %s, highest_text_wpm_today = %s''',(0, 0, 0, 0, 0, 0, 0, 0, 0, 0,))
    connector.connection.commit()