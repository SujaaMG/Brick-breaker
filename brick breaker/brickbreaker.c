#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <windows.h>

#define WIDTH 50
#define HEIGHT 25
#define BRICK_ROWS 5
#define PADDLE_LEN 8

char (*board)[WIDTH];
int *ballX, *ballY, *dx, *dy, *paddleX, *score, *lives;

void init() {
    board = malloc(HEIGHT * sizeof(*board));

    *ballX = WIDTH / 2;
    *ballY = HEIGHT - 3;
    *dx = 1;
    *dy = -1;
    *paddleX = WIDTH / 2 - PADDLE_LEN / 2;
    *score = 0;
    *lives = 3;

    for (int y = 0; y < HEIGHT; y++)
        for (int x = 0; x < WIDTH; x++)
            board[y][x] = ' ';

    // Bricks
    for (int y = 1; y <= BRICK_ROWS; y++)
        for (int x = 2; x < WIDTH - 2; x += 4)
            board[y][x] = '#';
}

void draw() {
    system("cls");

    for (int y = 0; y < HEIGHT; y++) {
        for (int x = 0; x < WIDTH; x++) {
            if (y == *ballY && x == *ballX)
                printf("O");
            else if (y == HEIGHT - 1 &&
                     x >= *paddleX &&
                     x < *paddleX + PADDLE_LEN)
                printf("=");
            else
                printf("%c", board[y][x]);
        }
        printf("\n");
    }

    printf("Score: %d  Lives: %d  (A/D to move)\n", *score, *lives);
}

void update() {
    *ballX += *dx;
    *ballY += *dy;

    // Wall bounce
    if (*ballX <= 0 || *ballX >= WIDTH - 1)
        *dx = -*dx;
    if (*ballY <= 0)
        *dy = -*dy;

    // Brick collision
    if (board[*ballY][*ballX] == '#') {
        board[*ballY][*ballX] = ' ';
        *dy = -*dy;
        (*score) += 10;
    }

    // Paddle collision
    if (*ballY == HEIGHT - 2 &&
        *ballX >= *paddleX &&
        *ballX < *paddleX + PADDLE_LEN)
        *dy = -*dy;

    // Lose life
    if (*ballY >= HEIGHT - 1) {
        (*lives)--;
        *ballX = WIDTH / 2;
        *ballY = HEIGHT - 3;
        *paddleX = WIDTH / 2 - PADDLE_LEN / 2;
    }
}

void input() {
    if (GetAsyncKeyState('A') & 0x8000) {
        if (*paddleX > 0) (*paddleX)--;
    }
    if (GetAsyncKeyState('D') & 0x8000) {
        if (*paddleX + PADDLE_LEN < WIDTH) (*paddleX)++;
    }
}

int main() {
    ballX = malloc(sizeof(int));
    ballY = malloc(sizeof(int));
    dx = malloc(sizeof(int));
    dy = malloc(sizeof(int));
    paddleX = malloc(sizeof(int));
    score = malloc(sizeof(int));
    lives = malloc(sizeof(int));

    srand(time(NULL));
    init();

    while (*lives > 0) {
        draw();
        input();
        update();
        Sleep(100);   // 100 ms delay
    }

    system("cls");
    printf("Game Over! Final Score: %d\n", *score);

    free(board);
    free(ballX);
    free(ballY);
    free(dx);
    free(dy);
    free(paddleX);
    free(score);
    free(lives);

    return 0;
}