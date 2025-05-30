import random
from wordarray import arr
from preparray import preparr

def random_text():
    length = random.randint(7, 11)  # inclusive
    preplen = random.randint(3, 5)  # inclusive
    total = length + preplen

    text = []
    i = j = 0

    while i + j < total:
        decide = random.randint(0, 1)
        if decide == 0 and i < length:
            word = random.choice(arr)
            text.append(word)
            i += 1
        elif decide == 1 and j < preplen:
            word = random.choice(preparr)
            text.append(word)
            j += 1
        # fallback: if one quota is full, fill from the other
        elif i < length:
            word = random.choice(arr)
            text.append(word)
            i += 1
        else:
            word = random.choice(preparr)
            text.append(word)
            j += 1

    return ' '.join(text)
