from PIL import Image

question = ""
with open('input/question.txt') as f:
    question = f.read()

 
img = Image.open('input/image.png')

# img.show()
print(img)
print(question)

# print("hey! Python has run", end='')