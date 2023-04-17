// Display/UI
import {
  TILE_STATUSES,
  createBoard,
  markTile,
  revealTile,
  checkWin,
  checkLose
} from "./minesweeper.js"

const BOARD_SIZE = 10
const NUMBER_OF_MINES = 10

const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES)
const boardElement = document.querySelector(".board")
const minesLeftText = document.querySelector("[data-mine-count]")
const messageText = document.querySelector(".subtext")

board.forEach(row => {
  row.forEach(tile => {
    boardElement.append(tile.element)
    tile.element.addEventListener("click", () => {
      revealTile(board, tile)
      checkGameEnd()
    })
    tile.element.addEventListener("contextmenu", (e) => {
      e.preventDefault()
      markTile(tile)
      listMineLeft()
    })
  })
})
boardElement.style.setProperty("--size", BOARD_SIZE)
minesLeftText.textContent = NUMBER_OF_MINES

const listMineLeft = () => {
  const markedTilesCount = board.reduce((count, row) => count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length, 0)

  minesLeftText.textContent = NUMBER_OF_MINES - markedTilesCount
}

const checkGameEnd = () => {
  const win = checkWin(board)
  const lose = checkLose(board)
  if (win || lose) {
    boardElement.addEventListener("click", stopProp, { capture: true })
    boardElement.addEventListener("contextmenu", stopProp, { capture: true })
  }

  if (win) {
    messageText.textContent = "You WIN"
    messageText.style.color = "lime"
  }
  if (lose) {
    messageText.textContent = "You LOSE"
    messageText.style.color = "red"
    board.forEach(row => {
      row.forEach(tile => {
        if (tile.status === TILE_STATUSES.MARKED) markTile(tile)
        if (tile.mine) revealTile(board, tile)
      })
    })
  }
}

const stopProp = e => {
  e.stopImmediatePropagation()
}