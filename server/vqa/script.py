from utils.models import VqaModel # NOTE: this dude is neccessary!
from utils import text_helper
from utils.resize_images import resize_image

import sys
import argparse
import numpy as np
import torch
from PIL import Image
import torchvision.transforms as transforms

# arguments:
root_dir_vqa = 'vqa/'
input_dir = root_dir_vqa+'utils'
max_qst_length = 30
max_num_ans = 10
batch_size = 128
num_workers = 8
image_size = 224
image_file_location = root_dir_vqa+'input/image.png'
question_file_location = root_dir_vqa+'input/question.txt'
model_location = root_dir_vqa+"utils/model-epoch-01.ckpt"

args_embed_size = 1024
args_word_embed_size = 300
args_num_layers = 2
args_hidden_size = 512


def get_transformed_image(image_file):

    # images: resize the image and convert the image
    with open(image_file, 'r+b') as f:
      with Image.open(f) as img:
          img = resize_image(img, [image_size, image_size]).convert('RGB')

    transform = transforms.Compose(
        [transforms.ToTensor(), transforms.Normalize((0.485, 0.456, 0.406), (0.229, 0.224, 0.225))])
    return transform(img)


def get_converted_question(question_file, qst_vocab):
    question_str = ""
    with open(question_file) as f:
        question_str = f.read()
    
    # questions: convert the question
    # vqa = np.load('/datasets/train.npy', allow_pickle=True)  # todo change this is wrong!
    qst2idc = np.array([qst_vocab.word2idx('<pad>')] * max_qst_length)  # padded with '<pad>' in 'ans_vocab'
    question_tokens_list = text_helper.tokenize(question_str)
    qst2idc[:len(question_tokens_list)] = [qst_vocab.word2idx(w) for w in question_tokens_list]
    return qst2idc


def answer():
    
    ans_vocab = text_helper.VocabDict(input_dir + '/vocab_answers.txt')
    qst_vocab = text_helper.VocabDict(input_dir + '/vocab_questions.txt')

    image = get_transformed_image(image_file=image_file_location)
    question = get_converted_question(question_file=question_file_location, qst_vocab=qst_vocab)

    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model_checkpoint = torch.load(model_location, map_location=device)
    model = VqaModel(
        embed_size=args_embed_size,
        qst_vocab_size=qst_vocab.vocab_size,
        ans_vocab_size=ans_vocab.vocab_size,
        word_embed_size=args_word_embed_size,
        num_layers=args_num_layers,
        hidden_size=args_hidden_size).to(device)
    model.load_state_dict(model_checkpoint)

    model.eval()

    # model output: give the inputs to the model
    # todo: this replication is unnecessary and has too much overhead!
    image = np.array( [image.numpy() for i in range(batch_size)] )
    image = torch.tensor( image )
    # input("press enter to continue...")
    question = torch.tensor( np.array( [np.array(question) for i in range(batch_size)] ) )
    image_tnsr = image.to(device)
    question_tnsr = question.to(device)
    # input("press enter to continue...")
    output_tnsr = model(image_tnsr, question_tnsr)  # [batch_size, ans_vocab_size=1000]
    # convert the model output to raw answer
    for indx in range(1):  # one question only!
        maxx = torch.max(output_tnsr, 1)
        outp = maxx[1][indx]
        answer = str(ans_vocab.idx2word(outp))
        print(answer, end='')



# if __name__ == '__main__':
#     parser = argparse.ArgumentParser()

#     parser.add_argument('--input_dir', type=str, default='./datasets', help='input directory for visual question '
#                                                                             'answering.')
#     parser.add_argument('--model_dir', type=str, default='./models', help='directory for saved models.')
#     parser.add_argument('--max_qst_length', type=int, default=30, help='maximum length of question. \
#                               the length in the VQA dataset = 26.')
#     parser.add_argument('--max_num_ans', type=int, default=10, help='maximum number of answers.')
#     parser.add_argument('--batch_size', type=int, default=128, help='batch_size.')
#     parser.add_argument('--num_workers', type=int, default=8, help='number of processes working on cpu.')
#     parser.add_argument('--image_size', type=int, default=224, help='size of images after resizing')
    
    # args = parser.parse_args()
    
    
    # main()

# print(VqaModel('oy!'))
answer()
sys.stdout.flush()