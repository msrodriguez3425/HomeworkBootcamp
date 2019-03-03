Sub hard()

    TotalVolYear
    YearlyPercent
    ConditionalFormat
    HighestValues



End Sub

Function HighestValues()

    Dim lastrow As Double
    Dim Allsheets As Integer
    
    Dim highest as Double
    Dim lowest as Double
    Dim GreatestVol as Double

    Dim highestTick as String
    Dim lowestTick as String
    Dim greatestTick as String

    Application.ScreenUpdating = False

    Sheets(1).Select
    
    'Counts number of sheets
    Allsheets = Application.Sheets.Count

    for sheet= 1 to Allsheets

        Range("P1").Value = "Ticker"
        Range("Q1").Value = "Value"
        Range("O2").Value = "Greatest % Increase"
        Range("O3").Value = "Greatest % Decrease"
        Range("O4").Value = "Greatest Total Volume"

        lastrow = Cells(Rows.Count, 1).End(xlUp).Row

        highest = Cells(2,11).Value
        highestTick = Cells(2,9).Value

        lowest = Cells(2,11).Value
        lowestTick = Cells(2,9).Value

        GreatestVol = Cells(2,12).Value
        greatestTick = Cells(2,9).Value

        for row = 2 to lastrow

            'Gets the percentage change for this row
            thisRow = Cells(row,11).Value
            'Gets the total volume for this row
            thisVol = Cells(row,12).Value

            'If this percentage INCREASE is the largest so far
            if thisRow > highest then
                highest = thisrow
                highestTick = Cells(row,9).Value
            end if

            'If this percentage DECREASE is the largest so far
            if thisRow < lowest then
                lowest = thisrow
                lowestTick = Cells(row,9).Value
            end if

            'If this total volume is the largest so far
            if thisVol > GreatestVol then
                GreatestVol = thisVol
                greatestTick = Cells(row,9).Value
            end if

        next row

        Range("P2").Value = highestTick
        Range("Q2").Value = highest

        Range("P3").Value = lowestTick
        Range("Q3").Value = lowest
        
        Range("P4").Value = greatestTick
        Range("Q4").Value = GreatestVol

        'Goes to the next sheet
        If Sheet <> Allsheets Then
            ActiveSheet.Next.Select
        End If

    next sheet

end Function

Function ConditionalFormat()
    
    Dim lastrow As Double
    Dim Allsheets As Integer

    Application.ScreenUpdating = False
    
    'Counts number of sheets
    Allsheets = Application.Sheets.Count

    Sheets(1).Select

    for sheet = 1 to Allsheets
        

        lastrow = Cells(Rows.Count, 1).End(xlUp).Row

        for row =2 to lastrow

            if cells(row,10).value < 0 then
                Cells(row,10).Interior.ColorIndex = 3
            elseif cells(row,10).value > 0 then
                Cells(row,10).Interior.ColorIndex = 4
            else 
                Cells(row,10).Interior.ColorIndex = 2
            end if


        next row

        'Goes to the next sheet
        If Sheet <> Allsheets Then
            ActiveSheet.Next.Select
        End If

    next sheet


end Function

Function YearlyPercent() 

        Sheets(1).Select

        Dim opn as Double
        Dim cls as Double
        Dim change as Double
        Dim percentage as Double
        Dim ticker As String
        Dim previous_ticker As String
        Dim lastrow As Double
        'j is the row index for the results
        Dim j As Integer
        Dim Allsheets As Integer
        
        'Counts number of sheets
        Allsheets = Application.Sheets.Count

        for sheet = 1 to Allsheets

            'Column titles for the variables we wish to extract: The total stock volume, and the correspoding Ticker value
            Range("J1").Value = "Yearly Change"
            Range("K1").Value = "Percent Change"

            'Initializing variables
            j = 2
            previous_ticker = Range("A2").Value
            lastrow = Cells(Rows.Count, 1).End(xlUp).Row
            opn = Range("C2").Value

            for row = 2 to lastrow


                ticker = Cells(row, 1).Value

                If row = lastrow Then

                    cls = Cells(row,6)

                    change = cls - opn 


                    percentage = 100*(change/opn)

                    Cells(j,10).value = change
                    Cells(j,11).value = percentage

                    exit for
                End If

                'This statement checks that ticker value HAS changed since previous row
                If ticker <> previous_ticker Then
                
                        cls = Cells(row - 1,6)

                        change = cls - opn 


                        percentage = 100*(change/opn)

                        Cells(j,10).value = change
                        Cells(j,11).value = percentage

                        opn = Cells(row,3)

                        Do while opn = 0
                            row = row + 1
                            opn = Cells(row,3)

                        loop

                        previous_ticker = ticker



                        j = j + 1

                end If

            next row

            'Goes to the next sheet
            If Sheet <> Allsheets Then
                ActiveSheet.Next.Select
            End If

        next sheet


end Function




Function TotalVolYear()

    'Declaration of variable: sum accumulates stock volume per row for given ticker value,
    'and ticker/previous_ticker keeps track of ticker value
    Dim sum As Double
    Dim ticker As String
    Dim previous_ticker As String
    Dim lastrow As Double
    'j is the row index for the results
    Dim j As Integer
    Dim Allsheets As Integer
    
    'Counts number of sheets
    Allsheets = Application.Sheets.Count

    'Goes to first sheet in workbook
    Sheets(1).Select

    'This loops executes the task from sheet 1 until final sheet in workbook
    For Sheet = 1 To Allsheets

        'Column titles for the variables we wish to extract: The total stock volume, and the correspoding Ticker value
        Range("I1").Value = "Ticker"
        Range("L1").Value = "Total Stock Volume"

        'Initializing variables
        j = 2
        sum = 0
        previous_ticker = Range("A2").Value
        Cells(j, 9).Value = previous_ticker
        lastrow = Cells(Rows.Count, 1).End(xlUp).Row

        
        'This loop checks the ticker value of each row, and accordingly sums the stock volume
        For Row = 2 To lastrow
            ticker = Cells(Row, 1).Value

            'This statement checks that ticker value HASN'T changed since previous row
            If ticker = previous_ticker Then
                sum = sum + Cells(Row, 7)
            
                'When checking the last row, print the sum (no next row to compare ticker)
                If Row = lastrow Then
                    Cells(j, 12) = sum
                End If
            
            'If ticker value HAS changed, print the previous ticker value and the sum in the results columns
            Else

                'Prints sum
                Cells(j, 12).Value = sum

                'Next row in results columns
                j = j + 1

                Cells(j, 9).Value = ticker
                
               
                previous_ticker = ticker
                
                'Reset sum to 0 and carry on
                sum = 0
                sum = sum + Cells(Row, 7)
            End If
        Next Row

        'Goes to the next sheet
        If Sheet <> Allsheets Then
            ActiveSheet.Next.Select
        End If

    Next Sheet






End Function

